/* src/modules/categoryCreator/categoryCreator.tsx */
// #section Imports
import { useState, useEffect } from 'react';
import type { CategoryCreatorModalProps, GradientColors } from './categoryCreator.types';
import { useCategoryCreator } from './categoryCreator.hooks';
import { 
  MODAL_TEXTS, 
  ANGLE_PRESETS,
  GRADIENT_PRESETS 
} from './categoryCreator.config';
import { 
  generateBackgroundCSS,
  isValidHexColor 
} from './categoryCreator.utils';
import styles from './categoryCreator.module.css';
// #end-section

// #component CategoryCreatorModal
/**
 * Modal para crear/editar categorías de productos.
 * 
 * Características:
 * - Nombre y descripción
 * - Imagen opcional (archivo local o URL)
 * - Color de texto personalizable
 * - Fondo sólido o gradiente
 * - Preview en tiempo real (abajo del formulario)
 * 
 * @example
 * <CategoryCreatorModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={(config) => saveCategory(config)}
 * />
 */
export function CategoryCreatorModal({
  isOpen,
  onClose,
  onConfirm,
  initialConfig,
  title = MODAL_TEXTS.title,
  confirmText = MODAL_TEXTS.confirmText,
  cancelText = MODAL_TEXTS.cancelText
}: CategoryCreatorModalProps) {
  // #hook useCategoryCreator
  const {
    config,
    setName,
    setDescription,
    setImageUrl,
    setTextColor,
    setBackgroundMode,
    setBackgroundColor,
    setGradientAngle,
    setGradientColors,
    applyGradientPreset,
    isValid,
    errors
  } = useCategoryCreator(initialConfig);
  // #end-hook
  
  // #state inputValues - Para inputs temporales
  const [nameInput, setNameInput] = useState(config.name);
  const [descriptionInput, setDescriptionInput] = useState(config.description || '');
  const [imageUrlInput, setImageUrlInput] = useState(config.imageUrl || '');
  const [textColorInput, setTextColorInput] = useState(config.textColor);
  const [bgColorInput, setBgColorInput] = useState(config.backgroundColor);
  
  // Estado para colores del gradiente
  const [gradientColorInputs, setGradientColorInputs] = useState<string[]>(
    config.gradient?.colors || ['#3B82F6', '#8B5CF6']
  );
  
  // Estado para manejo de imagen
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  // #end-state
  
  // #event - Sincronizar inputs con config
  useEffect(() => {
    setNameInput(config.name);
    setDescriptionInput(config.description || '');
    setImageUrlInput(config.imageUrl || '');
    setTextColorInput(config.textColor);
    setBgColorInput(config.backgroundColor);
    setGradientColorInputs(config.gradient?.colors || ['#3B82F6', '#8B5CF6']);
    
    // Si hay imageUrl inicial, mostrar en modo URL y como preview
    if (config.imageUrl) {
      setImageInputMode('url');
      setImagePreviewUrl(config.imageUrl);
    }
  }, [config]);
  // #end-event
  
  // #event handleTextColorChange
  /**
   * Maneja cambios en el color de texto.
   */
  const handleTextColorChange = (value: string) => {
    setTextColorInput(value);
    if (isValidHexColor(value)) {
      setTextColor(value);
    }
  };
  // #end-event
  
  // #event handleBgColorChange
  /**
   * Maneja cambios en el color de fondo sólido.
   */
  const handleBgColorChange = (value: string) => {
    setBgColorInput(value);
    if (isValidHexColor(value)) {
      setBackgroundColor(value);
    }
  };
  // #end-event
  
  // #event handleGradientColorChange
  /**
   * Maneja cambios en un color del gradiente.
   */
  const handleGradientColorChange = (index: number, value: string) => {
    const newInputs = [...gradientColorInputs];
    newInputs[index] = value;
    setGradientColorInputs(newInputs);
    
    if (isValidHexColor(value)) {
      const newColors = [...newInputs].filter(isValidHexColor) as GradientColors;
      if (newColors.length >= 2 && newColors.length <= 4) {
        setGradientColors(newColors);
      }
    }
  };
  // #end-event
  
  // #event handleAddGradientColor
  /**
   * Agrega un nuevo color al gradiente.
   */
  const handleAddGradientColor = () => {
    if (gradientColorInputs.length < 4) {
      const newInputs = [...gradientColorInputs, '#3B82F6'];
      setGradientColorInputs(newInputs);
      const newColors = newInputs.filter(isValidHexColor) as GradientColors;
      setGradientColors(newColors);
    }
  };
  // #end-event
  
  // #event handleRemoveGradientColor
  /**
   * Elimina un color del gradiente.
   */
  const handleRemoveGradientColor = (index: number) => {
    if (gradientColorInputs.length > 2) {
      const newInputs = gradientColorInputs.filter((_, i) => i !== index);
      setGradientColorInputs(newInputs);
      const newColors = newInputs.filter(isValidHexColor) as GradientColors;
      setGradientColors(newColors);
    }
  };
  // #end-event
  
  // #event handleImageFileChange
  /**
   * Maneja la selección de archivo de imagen.
   */
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato no válido. Solo JPG, PNG, GIF, WEBP');
      return;
    }
    
    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 5MB');
      return;
    }
    
    // Crear preview y guardar en config
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreviewUrl(dataUrl);
      // CRÍTICO: Guardar la imagen base64 en el config
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };
  // #end-event
  
  // #event handleClearImageFile
  /**
   * Limpia el archivo de imagen seleccionado.
   */
  const handleClearImageFile = () => {
    setImagePreviewUrl(null);
    setImageUrl(undefined);
    
    // Limpiar input file
    const fileInput = document.getElementById('category-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  // #end-event
  
  // #event handleSubmit
  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = () => {
    if (!isValid) return;
    
    // El config ya tiene la imageUrl actualizada (sea base64 o URL)
    onConfirm(config);
  };
  // #end-event
  
  // Si no está abierto, no renderizar
  if (!isOpen) return null;
  
  // #section render
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {/* Body */}
        <div className={styles.modalBody}>
          <form className={styles.form}>
            {/* Nombre */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.nameLabel}
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder={MODAL_TEXTS.namePlaceholder}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setName(e.target.value);
                }}
                maxLength={50}
              />
            </div>
            
            {/* Descripción */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.descriptionLabel}
              </label>
              <textarea
                className={styles.textarea}
                placeholder={MODAL_TEXTS.descriptionPlaceholder}
                value={descriptionInput}
                onChange={(e) => {
                  setDescriptionInput(e.target.value);
                  setDescription(e.target.value || undefined);
                }}
                maxLength={200}
              />
            </div>
            
            {/* Imagen */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.imageLabel}
              </label>
              
              {/* Tabs: Subir archivo / URL */}
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tab} ${
                    imageInputMode === 'file' ? styles.active : ''
                  }`}
                  onClick={() => {
                    setImageInputMode('file');
                    setImageUrlInput('');
                    if (!imagePreviewUrl) {
                      setImageUrl(undefined);
                    }
                  }}
                >
                  📁 {MODAL_TEXTS.imageUploadTab}
                </button>
                <button
                  type="button"
                  className={`${styles.tab} ${
                    imageInputMode === 'url' ? styles.active : ''
                  }`}
                  onClick={() => {
                    setImageInputMode('url');
                    setImagePreviewUrl(null);
                  }}
                >
                  🔗 {MODAL_TEXTS.imageUrlTab}
                </button>
              </div>
              
              {/* Contenido según tab seleccionado */}
              {imageInputMode === 'file' ? (
                <div className={styles.fileUploadSection}>
                  <input
                    type="file"
                    id="category-image-upload"
                    className={styles.fileInput}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageFileChange}
                  />
                  <label htmlFor="category-image-upload" className={styles.fileLabel}>
                    📎 {MODAL_TEXTS.imageSelectButton}
                  </label>
                  <p className={styles.helperText}>{MODAL_TEXTS.imageHelperText}</p>
                  
                  {/* Preview de imagen seleccionada */}
                  {imagePreviewUrl && (
                    <div className={styles.imagePreviewContainer}>
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        className={styles.clearImageBtn}
                        onClick={handleClearImageFile}
                      >
                        ✕ {MODAL_TEXTS.imageClearButton}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.urlInputSection}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={MODAL_TEXTS.imageUrlPlaceholder}
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setImageUrl(e.target.value || undefined);
                      setImagePreviewUrl(e.target.value || null);
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Color de texto */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.textColorLabel}
              </label>
              <div className={styles.colorInputGroup}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={config.textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                />
                <input
                  type="text"
                  className={styles.colorInput}
                  value={textColorInput}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  placeholder="#FFFFFF"
                  maxLength={7}
                />
              </div>
            </div>
            
            {/* Tabs: Sólido / Gradiente */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.backgroundModeLabel}
              </label>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tab} ${
                    config.backgroundMode === 'solid' ? styles.active : ''
                  }`}
                  onClick={() => setBackgroundMode('solid')}
                >
                  🎨 {MODAL_TEXTS.solidTab}
                </button>
                <button
                  type="button"
                  className={`${styles.tab} ${
                    config.backgroundMode === 'gradient' ? styles.active : ''
                  }`}
                  onClick={() => setBackgroundMode('gradient')}
                >
                  🌈 {MODAL_TEXTS.gradientTab}
                </button>
              </div>
            </div>
            
            {/* Contenido según modo seleccionado */}
            {config.backgroundMode === 'solid' && (
              <div className={styles.field}>
                <label className={styles.label}>
                  {MODAL_TEXTS.backgroundColorLabel}
                </label>
                <div className={styles.colorInputGroup}>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={config.backgroundColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.colorInput}
                    value={bgColorInput}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    placeholder="#3B82F6"
                    maxLength={7}
                  />
                </div>
              </div>
            )}
            
            {config.backgroundMode === 'gradient' && config.gradient && (
              <>
                {/* Dirección del gradiente */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    {MODAL_TEXTS.gradientAngleLabel}
                  </label>
                  <div className={styles.anglePresets}>
                    {ANGLE_PRESETS.map((preset) => {
                      // Generar el gradiente con los colores actuales
                      const previewGradient = `linear-gradient(${preset.value}deg, ${config.gradient!.colors.join(', ')})`;
                      
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          className={`${styles.anglePresetBtn} ${
                            config.gradient?.angle === preset.value ? styles.active : ''
                          }`}
                          style={{ background: previewGradient }}
                          onClick={() => setGradientAngle(preset.value)}
                          title={preset.description}
                          aria-label={preset.description}
                        >
                          {/* Sin contenido, solo el gradiente de fondo */}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Colores del gradiente */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    {MODAL_TEXTS.gradientColorsLabel}
                  </label>
                  <div className={styles.gradientColors}>
                    {gradientColorInputs.map((color, index) => (
                      <div key={index} className={styles.colorRow}>
                        <div className={styles.colorInputGroup}>
                          <input
                            type="color"
                            className={styles.colorPicker}
                            value={color}
                            onChange={(e) => handleGradientColorChange(index, e.target.value)}
                          />
                          <input
                            type="text"
                            className={styles.colorInput}
                            value={color}
                            onChange={(e) => handleGradientColorChange(index, e.target.value)}
                            placeholder="#3B82F6"
                            maxLength={7}
                          />
                        </div>
                        {gradientColorInputs.length > 2 && (
                          <button
                            type="button"
                            className={styles.removeColorBtn}
                            onClick={() => handleRemoveGradientColor(index)}
                          >
                            {MODAL_TEXTS.removeColorButton}
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {gradientColorInputs.length < 4 && (
                      <button
                        type="button"
                        className={styles.addColorBtn}
                        onClick={handleAddGradientColor}
                      >
                        {MODAL_TEXTS.addColorButton}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Presets de gradientes */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    {MODAL_TEXTS.presetsLabel}
                  </label>
                  <div className={styles.gradientPresets}>
                    {GRADIENT_PRESETS.map((preset) => {
                      const presetGradientCSS = `linear-gradient(${preset.gradient.angle}deg, ${preset.gradient.colors.join(', ')})`;
                      
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          className={styles.presetBtn}
                          style={{ background: presetGradientCSS }}
                          onClick={() => {
                            applyGradientPreset(preset.gradient);
                            setGradientColorInputs([...preset.gradient.colors]);
                          }}
                          title={preset.name}
                        >
                          <span className={styles.presetEmoji}>{preset.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            
            {/* Errores de validación */}
            {errors.length > 0 && (
              <div className={styles.errors}>
                {errors.map((error, index) => (
                  <p key={index} className={styles.error}>
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form>
        </div>
        
        {/* Preview Section - Fixed at bottom */}
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>{MODAL_TEXTS.previewTitle}</h3>
          <div
            className={styles.previewCard}
            style={{
              background: generateBackgroundCSS(config),
              color: config.textColor
            }}
          >
            <div className={styles.previewContent}>
              <h4 className={styles.previewName}>
                {config.name || 'Nombre de categoría'}
              </h4>
              {config.description && (
                <p className={styles.previewDescription}>
                  {config.description}
                </p>
              )}
            </div>
            {(config.imageUrl || imagePreviewUrl) && (
              <img
                src={imagePreviewUrl || config.imageUrl}
                alt="Preview"
                className={styles.previewImage}
              />
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
  // #end-section
}
// #end-component
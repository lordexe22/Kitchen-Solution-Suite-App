/* src/modules/categoryCreator/categoryCreator.tsx */
// #section Imports
import { useState, useEffect } from 'react';
import type { CategoryCreatorModalProps, GradientColors } from './categoryCreator.types';
import { useCategoryCreator } from './categoryCreator.hooks';
import { 
  MODAL_TEXTS, 
  PRESET_ICONS, 
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
 * - Ícono opcional
 * - Imagen opcional (Cloudinary)
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
    setIcon,
    setImageUrl,
    setTextColor,
    setBackgroundMode,
    setBackgroundColor,
    setGradientAngle,
    setGradientColors,
    applyGradientPreset,
    reset,
    isValid,
    errors
  } = useCategoryCreator(initialConfig);
  // #end-hook
  // #state inputValues - Para inputs temporales
  const [nameInput, setNameInput] = useState(config.name);
  const [descriptionInput, setDescriptionInput] = useState(config.description || '');
  const [iconInput, setIconInput] = useState(config.icon || '');
  const [imageUrlInput, setImageUrlInput] = useState(config.imageUrl || '');
  const [textColorInput, setTextColorInput] = useState(config.textColor);
  const [bgColorInput, setBgColorInput] = useState(config.backgroundColor);
  
  // Estado para colores del gradiente
  const [gradientColorInputs, setGradientColorInputs] = useState<string[]>(
    config.gradient?.colors || ['#3B82F6', '#8B5CF6']
  );
  // #end-state
  // #event - Sincronizar inputs con config
  useEffect(() => {
    setNameInput(config.name);
    setDescriptionInput(config.description || '');
    setIconInput(config.icon || '');
    setImageUrlInput(config.imageUrl || '');
    setTextColorInput(config.textColor);
    setBgColorInput(config.backgroundColor);
    if (config.gradient) {
      setGradientColorInputs([...config.gradient.colors]);
    }
  }, [config]);
  // #end-event
  // #function handleConfirm
  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(config);
    onClose();
  };
  // #end-function
  // #function handleCancel
  const handleCancel = () => {
    reset();
    onClose();
  };
  // #end-function
  // #function handleGradientColorChange
  const handleGradientColorChange = (index: number, value: string) => {
    const newInputs = [...gradientColorInputs];
    newInputs[index] = value;
    setGradientColorInputs(newInputs);
    
    // Solo actualizar config si es color válido
    if (isValidHexColor(value)) {
      const newColors = [...newInputs] as GradientColors;
      setGradientColors(newColors);
    }
  };
  // #end-function
  // #function handleAddGradientColor
  const handleAddGradientColor = () => {
    if (gradientColorInputs.length >= 4) return;
    const newInputs = [...gradientColorInputs, '#FFFFFF'];
    setGradientColorInputs(newInputs);
    setGradientColors(newInputs as GradientColors);
  };
  // #end-function
  // #function handleRemoveGradientColor
  const handleRemoveGradientColor = (index: number) => {
    if (gradientColorInputs.length <= 2) return;
    const newInputs = gradientColorInputs.filter((_, i) => i !== index);
    setGradientColorInputs(newInputs);
    setGradientColors(newInputs as GradientColors);
  };
  // #end-function
  // #function handleTextColorChange
  const handleTextColorChange = (value: string) => {
    setTextColorInput(value);
    if (isValidHexColor(value)) {
      setTextColor(value);
    }
  };
  // #end-function
  // #function handleBgColorChange
  const handleBgColorChange = (value: string) => {
    setBgColorInput(value);
    if (isValidHexColor(value)) {
      setBackgroundColor(value);
    }
  };
  // #end-function
  // #variable previewStyles
  const previewStyles = {
    background: generateBackgroundCSS(config),
    color: config.textColor
  };
  // #end-variable
  if (!isOpen) return null;
  return (
    <>
      {/* #section Overlay */}
      <div className={styles.overlay} onClick={handleCancel} />
      {/* #end-section */}
      {/* #section Modal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* #section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button 
            className={styles.closeBtn}
            onClick={handleCancel}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {/* #end-section */}
        {/* #section Body */}
        <div className={styles.body}>
          {/* #section Form */}
          <div className={styles.form}>
            
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
            
            {/* Ícono */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.iconLabel}
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder={MODAL_TEXTS.iconPlaceholder}
                value={iconInput}
                onChange={(e) => {
                  setIconInput(e.target.value);
                  setIcon(e.target.value || undefined);
                }}
                maxLength={2}
              />
              
              {/* Presets de íconos */}
              <div className={styles.presetIcons}>
                {Object.values(PRESET_ICONS).flat().map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`${styles.presetIconBtn} ${
                      config.icon === emoji ? styles.active : ''
                    }`}
                    onClick={() => {
                      setIconInput(emoji);
                      setIcon(emoji);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            {/* URL de Imagen */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.imageLabel}
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder={MODAL_TEXTS.imagePlaceholder}
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  setImageUrl(e.target.value || undefined);
                }}
              />
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
                {/* Ángulo del gradiente */}
                <div className={styles.field}>
                  <label className={styles.label}>
                    {MODAL_TEXTS.gradientAngleLabel}
                  </label>
                  <div className={styles.angleControl}>
                    {/* Presets de ángulos */}
                    <div className={styles.anglePresets}>
                      {ANGLE_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          className={`${styles.anglePresetBtn} ${
                            config.gradient?.angle === preset.value ? styles.active : ''
                          }`}
                          onClick={() => setGradientAngle(preset.value)}
                          title={preset.description}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Slider fino */}
                    <div className={styles.angleSlider}>
                      <input
                        type="range"
                        className={styles.slider}
                        min="0"
                        max="360"
                        value={config.gradient.angle}
                        onChange={(e) => setGradientAngle(Number(e.target.value))}
                      />
                      <span className={styles.angleValue}>
                        {config.gradient.angle}°
                      </span>
                    </div>
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
                            placeholder="#FFFFFF"
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
                  <div className={styles.presetsGrid}>
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        className={styles.presetBtn}
                        style={{
                          background: `linear-gradient(${preset.gradient.angle}deg, ${preset.gradient.colors.join(', ')})`
                        }}
                        onClick={() => {
                          applyGradientPreset(preset.gradient);
                          setGradientColorInputs([...preset.gradient.colors]);
                        }}
                        title={preset.name}
                      >
                        <span style={{ 
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.5))'
                        }}>
                          {preset.emoji}
                        </span>
                        <span className={styles.presetName}>
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
          </div>
          {/* #end-section Form */}
        </div>
        {/* #end-section Body */}

        {/* #section Preview */}
        <div className={styles.preview}>
          <h4 className={styles.previewTitle}>{MODAL_TEXTS.previewTitle}</h4>
          <div className={styles.previewArea}>
            <div 
              className={styles.categoryCard}
              style={previewStyles}
            >
              <div className={styles.categoryHeader}>
                {config.icon && (
                  <span className={styles.categoryIcon}>
                    {config.icon}
                  </span>
                )}
                <h3 className={styles.categoryName}>
                  {config.name || 'Nombre de categoría'}
                </h3>
              </div>
              
              {config.description && (
                <p className={styles.categoryDescription}>
                  {config.description}
                </p>
              )}
              
              {config.imageUrl && (
                <img 
                  src={config.imageUrl} 
                  alt={config.name}
                  className={styles.categoryImage}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Errors */}
          {errors.length > 0 && (
            <div className={styles.errors}>
              {errors.map((error, index) => (
                <p key={index} className={styles.errorText}>
                  ⚠️ {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* #end-section */}
        {/* #section Footer */}
        <div className={styles.footer}>
          <button 
            className="btn-sec btn-md"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className="btn-pri btn-md"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            {confirmText}
          </button>
        </div>
        {/* #end-section Footer */}
        
      </div>
      {/* #end-section Modal */}
    </>
  );
}
// #end-component
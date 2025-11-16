/* src/modules/tagCreator/tagCreator.tsx */

// #section Imports
import { useState, useEffect } from 'react';
import type { TagConfiguration, TagSize } from './tagCreator.types';
import { useTagCreator } from './tagCreator.hooks';
import { TAG_SIZES, PRESET_ICONS, MODAL_TEXTS } from './tagCreator.config';
import { generateTagCSS, isValidHexColor } from './tagCreator.utils';
import styles from './tagCreator.module.css';
// #end-section

// #interface TagCreatorModalProps
/**
 * Props del componente TagCreatorModal.
 */
export interface TagCreatorModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  
  /** Callback para cerrar el modal */
  onClose: () => void;
  
  /** Callback cuando se confirma la creación */
  onConfirm: (config: TagConfiguration) => void;
  
  /** Configuración inicial (para edición) */
  initialConfig?: TagConfiguration;
  
  /** Título del modal */
  title?: string;
  
  /** Texto del botón de confirmar */
  confirmText?: string;
  
  /** Texto del botón de cancelar */
  cancelText?: string;
}
// #end-interface

// #component TagCreatorModal
/**
 * Modal simplificado para crear/editar etiquetas.
 * 
 * Características:
 * - Sin scroll (todo visible)
 * - Color pickers simples (sin presets)
 * - Preview en tiempo real
 * - Tamaño afecta al texto
 * 
 * @example
 * <TagCreatorModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={(config) => saveTag(config)}
 * />
 */
export function TagCreatorModal({
  isOpen,
  onClose,
  onConfirm,
  initialConfig,
  title = MODAL_TEXTS.title,
  confirmText = MODAL_TEXTS.confirmText,
  cancelText = MODAL_TEXTS.cancelText
}: TagCreatorModalProps) {
  
  // #hook useTagCreator
  const {
    config,
    setName,
    setTextColor,
    setBackgroundColor,
    setIcon,
    toggleBorder,
    setSize,
    reset,
    isValid,
    errors
  } = useTagCreator(initialConfig);
  // #end-hook
  
  // #state inputValues - Para inputs temporales
  const [textColorInput, setTextColorInput] = useState(config.textColor);
  const [bgColorInput, setBgColorInput] = useState(config.backgroundColor);
  const [iconInput, setIconInput] = useState(config.icon || '');
  // #end-state
  
  // #event - Sincronizar inputs con config
  useEffect(() => {
    setTextColorInput(config.textColor);
    setBgColorInput(config.backgroundColor);
    setIconInput(config.icon || '');
  }, [config]);
  // #end-event
  
  // #function handleConfirm
  const handleConfirm = () => {
    if (isValid) {
      onConfirm(config);
      onClose();
    }
  };
  // #end-function
  // #function handleCancel
  const handleCancel = () => {
    reset();
    onClose();
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
  // #function handleIconChange
  const handleIconChange = (value: string) => {
    setIconInput(value);
    setIcon(value.trim() || undefined);
  };
  // #end-function
  // #memo tagStyles - Estilos calculados para el preview
  const tagStyles: React.CSSProperties = {
    ...generateTagCSS(config),
    ...TAG_SIZES[config.size]
  };
  // #end-memo
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* #section Overlay */}
      <div className={styles.overlay} onClick={handleCancel} />
      {/* #end-section */}
      {/* #section Modal */}
      <div className={styles.modal}>
        {/* #section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button 
            className={styles.closeBtn}
            onClick={handleCancel}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {/* #end-section */}
        {/* #section Body */}
        <div className={styles.body}>
          {/* #section Form */}
          <div className={styles.form}>
            
            {/* Input: Nombre */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.nameLabel}
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setName(e.target.value)}
                placeholder={MODAL_TEXTS.namePlaceholder}
                className={styles.input}
                maxLength={50}
              />
            </div>
            
            {/* Input: Color de texto */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.textColorLabel}
              </label>
              <div className={styles.colorInputGroup}>
                <input
                  type="color"
                  value={isValidHexColor(textColorInput) ? textColorInput : '#3B82F6'}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className={styles.colorPicker}
                />
                <input
                  type="text"
                  value={textColorInput}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  onBlur={() => {
                    if (!isValidHexColor(textColorInput)) {
                      setTextColorInput(config.textColor);
                    }
                  }}
                  placeholder="#3B82F6"
                  className={styles.colorInput}
                  maxLength={7}
                />
              </div>
            </div>
            
            {/* Input: Color de fondo */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.backgroundColorLabel}
              </label>
              <div className={styles.colorInputGroup}>
                <input
                  type="color"
                  value={isValidHexColor(bgColorInput) ? bgColorInput : '#DBEAFE'}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  className={styles.colorPicker}
                />
                <input
                  type="text"
                  value={bgColorInput}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  onBlur={() => {
                    if (!isValidHexColor(bgColorInput)) {
                      setBgColorInput(config.backgroundColor);
                    }
                  }}
                  placeholder="#DBEAFE"
                  className={styles.colorInput}
                  maxLength={7}
                />
              </div>
            </div>
            
            {/* Input: Ícono */}
            <div className={styles.field}>
              <label className={styles.label}>
                {MODAL_TEXTS.iconLabel}
              </label>
              <input
                type="text"
                value={iconInput}
                onChange={(e) => handleIconChange(e.target.value)}
                placeholder={MODAL_TEXTS.iconPlaceholder}
                className={styles.input}
                maxLength={10}
              />
              {/* Preset icons */}
              <div className={styles.presetIcons}>
                {Object.values(PRESET_ICONS).flat().slice(0, 16).map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`${styles.presetIconBtn} ${config.icon === icon ? styles.active : ''}`}
                    onClick={() => handleIconChange(icon)}
                    title={icon}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Checkbox: Borde y Tamaño en misma fila */}
            <div className={styles.fieldRow}>
              {/* Checkbox: Borde */}
              <div className={styles.fieldHalf}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={config.hasBorder}
                    onChange={toggleBorder}
                    className={styles.checkbox}
                  />
                  <span>{MODAL_TEXTS.borderLabel}</span>
                </label>
              </div>
              
              {/* Select: Tamaño */}
              <div className={styles.fieldHalf}>
                <label className={styles.label}>
                  {MODAL_TEXTS.sizeLabel}
                </label>
                <div className={styles.sizeButtons}>
                  {(['small', 'medium', 'large'] as TagSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeBtn} ${config.size === size ? styles.active : ''}`}
                      onClick={() => setSize(size)}
                    >
                      {size === 'small' && 'S'}
                      {size === 'medium' && 'M'}
                      {size === 'large' && 'L'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
          {/* #end-section */}
          
          {/* #section Preview */}
          <div className={styles.preview}>
            <h4 className={styles.previewTitle}>{MODAL_TEXTS.previewTitle}</h4>
            <div className={styles.previewArea}>
              <div style={tagStyles} className={styles.tag}>
                {config.icon && (
                  <span className={styles.tagIcon}>
                    {config.icon}
                  </span>
                )}
                <span className={styles.tagName}>
                  {config.name || 'Nombre de etiqueta'}
                </span>
              </div>
            </div>
            
            {/* Errors dentro del preview */}
            {errors.length > 0 && (
              <div className={styles.errors}>
                {errors.map((error, index) => (
                  <p key={index} className={styles.errorText}>⚠️ {error}</p>
                ))}
              </div>
            )}
          </div>
          {/* #end-section */}
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
        {/* #end-section */}
      </div>
      {/* #end-section */}
    </>
  );
}
// #end-component
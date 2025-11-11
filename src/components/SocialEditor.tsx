/* src/components/SocialEditor/SocialEditor.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { BranchSocial, SocialPlatform } from '../store/Branches.types';
import { SOCIAL_PLATFORMS } from '../store/Branches.types';
import styles from './SocialEditor.module.css';
import '/src/styles/button.css';
import '/src/styles/modal.css';
// #end-section

// #interface SocialEditorProps
interface SocialEditorProps {
  /** Plataforma a editar */
  platform: SocialPlatform;
  /** Red social existente (si hay) */
  social?: BranchSocial | null;
  /** Callback al guardar */
  onSave: (data: { url: string | null }) => void;
  /** Callback al cancelar */
  onCancel: () => void;
  /** Posición del popover */
  position?: { top: number; left: number };
}
// #end-interface

// #component SocialEditor
/**
 * Componente para editar una red social específica.
 * Aparece como un popover sobre la celda clickeada.
 */
const SocialEditor = ({ platform, social, onSave, onCancel, position }: SocialEditorProps) => {
  const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === platform);
  
  const [url, setUrl] = useState(social?.url || '');

  useEffect(() => {
    setUrl(social?.url || '');
  }, [social]);

  const handleSave = () => {
    // Si está vacío, se interpreta como eliminar
    onSave({
      url: url.trim() === '' ? null : url.trim()
    });
  };

  const handleDelete = () => {
    if (confirm(`¿Eliminar ${platformInfo?.label}?`)) {
      onSave({ url: null });
    }
  };

  const popoverStyle = position ? {
    position: 'fixed' as const,
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 1000
  } : {};

  return (
    <>
      {/* Overlay para cerrar al hacer clic afuera */}
      <div className={styles.overlay} onClick={onCancel} />
      
      {/* Popover */}
      <div className={styles.popover} style={popoverStyle}>
        <div className={styles.header}>
          <span className={styles.platformIcon}>{platformInfo?.icon}</span>
          <h3 className={styles.title}>{platformInfo?.label}</h3>
        </div>
        
        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={platformInfo?.placeholder}
              className={styles.input}
              autoFocus
            />
            <p className={styles.hint}>
              Deja vacío para eliminar esta red social
            </p>
          </div>
        </div>
        
        <div className={styles.footer}>
          {social && (
            <button 
              className="btn-danger btn-sm" 
              onClick={handleDelete}
              style={{ marginRight: 'auto' }}
            >
              🗑️ Eliminar
            </button>
          )}
          <button className="btn-sec btn-sm" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-pri btn-sm" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default SocialEditor;
// #end-component
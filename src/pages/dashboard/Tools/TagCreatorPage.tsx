/* src/pages/dashboard/Tools/TagCreatorPage.tsx */
// #section imports
import { useState } from 'react';
import { TagCreatorModal } from '../../../modules/tagCreator';
import type { TagConfiguration } from '../../../modules/tagCreator';
import { useTagsStore } from '../../../store/Tags.store';
import styles from './TagCreatorPage.module.css';
// #end-section

// #component TagCreatorPage
/**
 * Página para crear y gestionar etiquetas personalizadas.
 * 
 * Características:
 * - Botón para abrir modal de creación
 * - Sección de tags del sistema (inmutables)
 * - Sección de tags personalizados (editables/eliminables)
 */
export default function TagCreatorPage() {
  // #state showModal
  const [showModal, setShowModal] = useState(false);
  // #end-state
  
  // #state tags from store
  const { systemTags, userTags, addUserTag, removeUserTag, isSystemTag } = useTagsStore();
  // #end-state
  
  // #function handleTagCreated
  /**
   * Maneja la creación de un nuevo tag.
   * Guarda el tag en el store y cierra el modal.
   */
  const handleTagCreated = (config: TagConfiguration) => {
    addUserTag(config);
    setShowModal(false);
  };
  // #end-function
  
  // #function handleDeleteTag
  /**
   * Maneja la eliminación de un tag.
   * Pide confirmación antes de eliminar.
   */
  const handleDeleteTag = (tagName: string) => {
    // Verificar que no sea un system tag
    if (isSystemTag(tagName)) {
      alert('No se pueden eliminar las etiquetas del sistema');
      return;
    }
    
    const confirmed = window.confirm(`¿Eliminar la etiqueta "${tagName}"?`);
    if (confirmed) {
      removeUserTag(tagName);
    }
  };
  // #end-function
  
  // #function getTagStyles
  /**
   * Genera los estilos CSS para renderizar un tag.
   */
  const getTagStyles = (tag: TagConfiguration): React.CSSProperties => {
    const sizeMap = {
      small: '0.75rem',
      medium: '0.875rem',
      large: '1rem'
    };
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.75rem',
      backgroundColor: tag.backgroundColor,
      color: tag.textColor,
      fontSize: sizeMap[tag.size],
      borderRadius: '0.375rem',
      border: tag.hasBorder ? `2px solid ${tag.textColor}` : 'none',
      fontWeight: 500,
      whiteSpace: 'nowrap'
    };
  };
  // #end-function
  
  // #section return
  return (
    <div className={styles.container}>
      {/* #section Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Tag Creator</h2>
        <button 
          className="btn-pri btn-md"
          onClick={() => setShowModal(true)}
        >
          + Crear Nueva Etiqueta
        </button>
      </div>
      {/* #end-section */}
      {/* #section User Tags */}
      <div className={styles.tagsSection}>
        <h3 className={styles.sectionTitle}>
          ✏️ Mis Etiquetas Personalizadas ({userTags.length})
        </h3>
        <p className={styles.sectionSubtitle}>
          Etiquetas creadas por ti
        </p>
        
        {userTags.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No has creado etiquetas personalizadas. ¡Crea una nueva para comenzar!
            </p>
          </div>
        ) : (
          <div className={styles.tagsList}>
            {userTags.map((tag) => (
              <div key={tag.name} className={styles.tagItem}>
                <div style={getTagStyles(tag)} className={styles.tagPreview}>
                  {tag.icon && (
                    <span className={styles.tagIcon}>{tag.icon}</span>
                  )}
                  <span className={styles.tagName}>{tag.name}</span>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteTag(tag.name)}
                  title="Eliminar etiqueta"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* #end-section */}
      {/* #section System Tags */}
      <div className={styles.tagsSection}>
        <h3 className={styles.sectionTitle}>
          🏷️ Etiquetas del Sistema ({systemTags.length})
        </h3>
        <p className={styles.sectionSubtitle}>
          Etiquetas predeterminadas siempre disponibles
        </p>
        
        <div className={styles.tagsList}>
          {systemTags.map((tag) => (
            <div key={tag.name} className={styles.tagItem}>
              <div style={getTagStyles(tag)} className={styles.tagPreview}>
                {tag.icon && (
                  <span className={styles.tagIcon}>{tag.icon}</span>
                )}
                <span className={styles.tagName}>{tag.name}</span>
              </div>
              <span className={styles.systemBadge}>Sistema</span>
            </div>
          ))}
        </div>
      </div>
      {/* #end-section */}
      

      {/* #section Modal */}
      <TagCreatorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleTagCreated}
      />
      {/* #end-section */}
    </div>
  );
  // #end-section
}
// #end-component
/* src/components/TagSelector/TagSelector.tsx */
import { useState, useMemo } from 'react';
import { useTagsStore } from '../../store/Tags.store';
import type { TagConfiguration } from '../../modules/tagCreator';
import styles from './TagSelector.module.css';

interface TagSelectorProps {
  selectedTags: TagConfiguration[];
  onChange: (tags: TagConfiguration[]) => void;
  label?: string;
}

export function TagSelector({ 
  selectedTags, 
  onChange, 
  label = "Etiquetas" 
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getAllTags } = useTagsStore();
  
  const allTags = useMemo(() => getAllTags(), [getAllTags]);
  
  const isTagSelected = (tag: TagConfiguration): boolean => {
    return selectedTags.some(t => t.name === tag.name);
  };
  
  const toggleTag = (tag: TagConfiguration) => {
    if (isTagSelected(tag)) {
      onChange(selectedTags.filter(t => t.name !== tag.name));
    } else {
      onChange([...selectedTags, tag]);
    }
  };
  
  const removeTag = (tagName: string) => {
    onChange(selectedTags.filter(t => t.name !== tagName));
  };
  
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
      whiteSpace: 'nowrap',
      cursor: 'pointer'
    };
  };
  
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      
      <div className={styles.selectedTags}>
        {selectedTags.length === 0 ? (
          <span className={styles.placeholder}>Sin etiquetas seleccionadas</span>
        ) : (
          selectedTags.map((tag) => (
            <div 
              key={tag.name} 
              style={getTagStyles(tag)}
              className={styles.selectedTag}
            >
              {tag.icon && <span>{tag.icon}</span>}
              <span>{tag.name}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeTag(tag.name)}
                title="Quitar etiqueta"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      
      <button
        type="button"
        className={styles.addBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▲ Cerrar selector' : '▼ Agregar etiquetas'}
      </button>
      
      {isOpen && (
        <div className={styles.tagsList}>
          {allTags.length === 0 ? (
            <p className={styles.emptyMessage}>
              No hay etiquetas disponibles. Crea etiquetas personalizadas en el Tag Creator.
            </p>
          ) : (
            allTags.map((tag) => {
              const selected = isTagSelected(tag);
              return (
                <div
                  key={tag.name}
                  className={`${styles.tagOption} ${selected ? styles.selected : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {}}
                    className={styles.checkbox}
                  />
                  <div style={getTagStyles(tag)} className={styles.tagPreview}>
                    {tag.icon && <span>{tag.icon}</span>}
                    <span>{tag.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
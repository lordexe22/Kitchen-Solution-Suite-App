/* src/components/DraggableCategory/DraggableCategory.tsx */
// #section imports
import { useState, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategoryWithParsedGradient } from '../../store/Categories.types';
import { generateBackgroundCSS } from '../../modules/categoryCreator/categoryCreator.utils';
import type { CategoryConfiguration } from '../../modules/categoryCreator/categoryCreator.types';
import styles from './DraggableCategory.module.css';
// #end-section

// #interface DraggableCategoryProps
interface DraggableCategoryProps {
  category: CategoryWithParsedGradient;
  onEdit: () => void;
  onDelete: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  canPaste?: boolean;
  children?: ReactNode; // Contenido expandible (productos)
}
// #end-interface

// #component DraggableCategory
/**
 * Card de categoría con capacidad de drag & drop y expansión.
 * Usa @dnd-kit/sortable para el reordenamiento.
 * Se expande para mostrar productos cuando tiene children.
 */
export default function DraggableCategory({
  category,
  onEdit,
  onDelete,
  onCopy,
  onPaste,
  canPaste = false,
  children
}: DraggableCategoryProps) {
  // #state [isExpanded, setIsExpanded]
  const [isExpanded, setIsExpanded] = useState(false);
  // #end-state

  // #const hasChildren
  const hasChildren = !!children;
  // #end-const

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting
  } = useSortable({ 
    id: category.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  // Convertir category a configuration para generateBackgroundCSS
  const categoryConfig: CategoryConfiguration = {
    name: category.name,
    description: category.description || undefined,
    imageUrl: category.imageUrl || undefined,
    textColor: category.textColor,
    backgroundMode: category.backgroundMode,
    backgroundColor: category.backgroundColor,
    gradient: category.gradient
  };

  // #event handleToggle
  /**
   * Expande/colapsa la categoría para mostrar productos.
   */
  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(prev => !prev);
    }
  };
  // #end-event

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.categoryCard} ${isDragging ? styles.dragging : ''}`}
    >
      {/* Drag Handle */}
      <div
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
      >
        <span className={styles.dragIcon}>⋮⋮</span>
      </div>

      {/* Category Header */}
      <div className={styles.categoryWrapper}>
        <div
          className={styles.categoryContent}
          style={{
            background: generateBackgroundCSS(categoryConfig),
            color: category.textColor
          }}
          onClick={handleToggle}
        >
          {/* Expand Icon (si tiene children) */}
          {hasChildren && (
            <div className={styles.expandIconWrapper}>
              <span className={`${styles.expandIcon} ${isExpanded ? styles.isExpanded : ''}`}>
                ▶
              </span>
            </div>
          )}

          <div className={styles.categoryInfo}>
            <h4 className={styles.categoryName}>{category.name}</h4>
            {category.description && (
              <p className={styles.categoryDescription}>
                {category.description}
              </p>
            )}
          </div>

          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={category.name}
              className={styles.categoryImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Action Buttons */}
          <div className={styles.categoryActions}>
            {onCopy && (
              <button
                className={styles.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
                title="Copiar categoría"
              >
                📋
              </button>
            )}
            {onPaste && (
              <button
                className={styles.actionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onPaste();
                }}
                disabled={!canPaste}
                title={canPaste ? "Pegar categoría" : "No hay categoría copiada"}
                style={{
                  opacity: canPaste ? 1 : 0.5,
                  cursor: canPaste ? 'pointer' : 'not-allowed'
                }}
              >
                📂
              </button>
            )}
            <button
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Expanded Content (Products) */}
        {isExpanded && hasChildren && (
          <div className={styles.expandedContent}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
// #end-component
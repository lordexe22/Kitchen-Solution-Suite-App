/* src/components/DraggableCategory/DraggableCategory.tsx */
// #section imports
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
}
// #end-interface

// #component DraggableCategory
/**
 * Card de categoría con capacidad de drag & drop.
 * Usa @dnd-kit/sortable para el reordenamiento.
 */
export default function DraggableCategory({
  category,
  onEdit,
  onDelete
}: DraggableCategoryProps) {
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
    // 🔧 SOLUCIÓN: Prevenir animaciones de layout automáticas durante el sorting
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    // 🔧 Solo aplicar transición si NO está en sorting (previene el salto)
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

      {/* Category Content */}
      <div
        className={styles.categoryContent}
        style={{
          background: generateBackgroundCSS(categoryConfig),
          color: category.textColor
        }}
      >
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
          <button
            className={styles.actionBtn}
            onClick={onEdit}
            title="Editar"
          >
            ✏️
          </button>
          <button
            className={styles.actionBtn}
            onClick={onDelete}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
// #end-component
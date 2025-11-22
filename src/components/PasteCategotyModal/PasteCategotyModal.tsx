/* src/components/PasteCategoryModal/PasteCategoryModal.tsx */
// #section imports
import type { ClipboardCategory } from '../../store/Clipboard.types';
import styles from './PasteCategoryModal.module.css';
// #end-section

// #interface PasteCategoryModalProps
/**
 * Props del modal de confirmación para pegar categoría.
 */
interface PasteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: ClipboardCategory | null;
  targetBranchName?: string;
  isLoading?: boolean;
}
// #end-interface

// #component PasteCategoryModal
/**
 * Modal de confirmación para pegar una categoría copiada.
 * Muestra información de la categoría que se va a duplicar.
 * 
 * @param {PasteCategoryModalProps} props - Props del componente
 * @returns {JSX.Element | null} Modal o null si no está abierto
 * 
 * @example
 * <PasteCategoryModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleConfirmPaste}
 *   category={copiedCategory}
 *   targetBranchName="Sucursal Centro"
 * />
 */
export default function PasteCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  category,
  targetBranchName,
  isLoading = false
}: PasteCategoryModalProps) {
  // #condition - No renderizar si no está abierto
  if (!isOpen || !category) return null;
  // #end-condition

  // #event handleConfirm
  /**
   * Maneja la confirmación de pegar.
   */
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };
  // #end-event

  // #event handleBackdropClick
  /**
   * Cierra el modal al hacer clic en el backdrop.
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };
  // #end-event

  // #section return
  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* #section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>📂 Pegar Categoría</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {/* #end-section */}

        {/* #section Content */}
        <div className={styles.content}>
          <p className={styles.description}>
            Se duplicará la siguiente categoría con todos sus productos:
          </p>

          {/* #section Category Preview */}
          <div className={styles.categoryPreview}>
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
            
            <div className={styles.categoryInfo}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              {category.description && (
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
              )}
            </div>
          </div>
          {/* #end-section */}

          {/* #section Target Info */}
          {targetBranchName && (
            <div className={styles.targetInfo}>
              <p className={styles.targetLabel}>Destino:</p>
              <p className={styles.targetName}>{targetBranchName}</p>
            </div>
          )}
          {/* #end-section */}

          {/* #section Warning */}
          <div className={styles.warning}>
            <span className={styles.warningIcon}>⚠️</span>
            <p className={styles.warningText}>
              Se duplicarán la categoría y <strong>todos sus productos</strong> (incluyendo imágenes).
            </p>
          </div>
          {/* #end-section */}
        </div>
        {/* #end-section */}

        {/* #section Footer */}
        <div className={styles.footer}>
          <button
            className="btn-sec btn-md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-pri btn-md"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Duplicando...' : 'Confirmar y Pegar'}
          </button>
        </div>
        {/* #end-section */}
      </div>
    </div>
  );
  // #end-section
}
// #end-component
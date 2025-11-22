/* src/components/PasteProductModal/PasteProductModal.tsx */
// #section imports
import type { ClipboardProduct } from '../../store/Clipboard.types';
import styles from './PasteProductModal.module.css';
// #end-section

// #interface PasteProductModalProps
/**
 * Props del modal de confirmación para pegar producto.
 */
interface PasteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: ClipboardProduct | null;
  targetCategoryName?: string;
  isLoading?: boolean;
}
// #end-interface

// #component PasteProductModal
/**
 * Modal de confirmación para pegar un producto copiado.
 * Muestra información del producto que se va a duplicar.
 * 
 * @param {PasteProductModalProps} props - Props del componente
 * @returns {JSX.Element | null} Modal o null si no está abierto
 * 
 * @example
 * <PasteProductModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleConfirmPaste}
 *   product={copiedProduct}
 *   targetCategoryName="Bebidas"
 * />
 */
export default function PasteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  targetCategoryName,
  isLoading = false
}: PasteProductModalProps) {
  // #condition - No renderizar si no está abierto
  if (!isOpen || !product) return null;
  // #end-condition

  // #const - Parsear imágenes del producto
  const productImages = product.images ? JSON.parse(product.images) : [];
  const mainImage = productImages.length > 0 ? productImages[0] : null;
  // #end-const

  // #const - Calcular precio con descuento
  const basePrice = parseFloat(product.basePrice);
  const discount = product.discount ? parseFloat(product.discount) : 0;
  const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  // #end-const

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
          <h2 className={styles.title}>📂 Pegar Producto</h2>
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
            Se duplicará el siguiente producto:
          </p>

          {/* #section Product Preview */}
          <div className={styles.productPreview}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className={styles.productImage}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen';
                }}
              />
            ) : (
              <div className={styles.productImagePlaceholder}>
                📦
              </div>
            )}
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              
              {product.description && (
                <p className={styles.productDescription}>
                  {product.description}
                </p>
              )}

              {/* #section Price Info */}
              <div className={styles.priceInfo}>
                {discount > 0 ? (
                  <>
                    <span className={styles.originalPrice}>
                      ${basePrice.toFixed(2)}
                    </span>
                    <span className={styles.finalPrice}>
                      ${finalPrice.toFixed(2)}
                    </span>
                    <span className={styles.discountBadge}>
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <span className={styles.finalPrice}>
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {/* #end-section */}
            </div>
          </div>
          {/* #end-section */}

          {/* #section Target Info */}
          {targetCategoryName && (
            <div className={styles.targetInfo}>
              <p className={styles.targetLabel}>Destino:</p>
              <p className={styles.targetName}>{targetCategoryName}</p>
            </div>
          )}
          {/* #end-section */}

          {/* #section Info */}
          <div className={styles.info}>
            <span className={styles.infoIcon}>ℹ️</span>
            <p className={styles.infoText}>
              Se duplicarán el producto y <strong>todas sus imágenes</strong>.
              {product.hasStockControl && ' El stock se reiniciará.'}
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
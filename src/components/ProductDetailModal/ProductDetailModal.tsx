/* src/components/ProductDetailModal/ProductDetailModal.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { ProductWithCalculatedPrice } from '../../store/Products.types';
import styles from './ProductDetailModal.module.css';
// #end-section

// #interface ProductDetailModalProps
interface ProductDetailModalProps {
  /** Si el modal está visible */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Producto a mostrar */
  product: ProductWithCalculatedPrice | null;
}
// #end-interface

// #component ProductDetailModal
/**
 * Modal de detalle de producto para vista de cliente final.
 * Muestra imágenes, precio, descripción y etiquetas del producto.
 * Diseñado para menús digitales de restaurantes/cafés.
 */
export default function ProductDetailModal({
  isOpen,
  onClose,
  product
}: ProductDetailModalProps) {
  // #state - Control de imagen activa en galería
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // #end-state

  // #effect - Reset imagen activa cuando cambia el producto
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
    }
  }, [product]);
  // #end-effect

  // #effect - Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  // #end-effect

  // #handler - Cerrar modal al hacer click en overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  // #end-handler

  // #handler - Cambiar imagen en galería
  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
  };
  // #end-handler

  // #handler - Navegación con teclado (escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  // #end-handler

  if (!isOpen || !product) return null;

  // #const - Variables del producto
  const hasImages = product.images.length > 0;
  const hasMultipleImages = product.images.length > 1;
  const displayPrice = product.finalPrice.toFixed(2);
  const originalPrice = product.hasDiscount ? parseFloat(product.basePrice).toFixed(2) : null;
  const discountPercentage = product.hasDiscount ? parseFloat(product.discount!).toFixed(0) : null;
  // #end-const

  return (
    <div 
      className={styles.overlay} 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className={styles.modal}>
        {/* #section Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        {/* #end-section */}

        {/* #section Image Gallery */}
        <div className={styles.imageSection}>
          {hasImages ? (
            <>
              {/* Imagen principal */}
              <div className={styles.mainImageContainer}>
                <img
                  src={product.images[activeImageIndex]}
                  alt={`${product.name} - imagen ${activeImageIndex + 1}`}
                  className={styles.mainImage}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
                  }}
                />
                
                {/* Badge de descuento superpuesto */}
                {product.hasDiscount && (
                  <div className={styles.discountBadge}>
                    -{discountPercentage}%
                  </div>
                )}

                {/* Indicador de no disponible */}
                {!product.isAvailable && (
                  <div className={styles.unavailableBadge}>
                    No disponible
                  </div>
                )}
              </div>

              {/* Dots de navegación (si hay múltiples imágenes) */}
              {hasMultipleImages && (
                <div className={styles.dotsContainer}>
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${index === activeImageIndex ? styles.dotActive : ''}`}
                      onClick={() => handleImageChange(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              )}

              {/* Thumbnails (si hay múltiples imágenes) */}
              {hasMultipleImages && (
                <div className={styles.thumbnailsContainer}>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${index === activeImageIndex ? styles.thumbnailActive : ''}`}
                      onClick={() => handleImageChange(index)}
                      type="button"
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className={styles.thumbnailImage}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x80?text=N/A';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noImagePlaceholder}>
              <span className={styles.noImageIcon}>📦</span>
              <p className={styles.noImageText}>Sin imagen disponible</p>
            </div>
          )}
        </div>
        {/* #end-section */}

        {/* #section Product Info */}
        <div className={styles.infoSection}>
          {/* Nombre del producto */}
          <h2 id="product-detail-title" className={styles.productName}>
            {product.name}
          </h2>

          {/* Sección de precio */}
          <div className={styles.priceSection}>
            {product.hasDiscount ? (
              <>
                <span className={styles.finalPrice}>${displayPrice}</span>
                <span className={styles.originalPrice}>${originalPrice}</span>
              </>
            ) : (
              <span className={styles.finalPrice}>${displayPrice}</span>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <p className={styles.description}>
              {product.description}
            </p>
          )}

          {/* Tags/Etiquetas (placeholder - para implementación futura) */}
          {/* TODO: Integrar con sistema de tags cuando esté disponible */}
          <div className={styles.tagsContainer}>
            {/* Ejemplo de tags - reemplazar con datos reales */}
            {/* <span className={styles.tag}>🌱 Vegano</span> */}
            {/* <span className={styles.tag}>🚫 Sin Gluten</span> */}
          </div>

          {/* Información de stock (solo si tiene control de stock) */}
          {product.hasStockControl && product.currentStock !== null && (
            <div className={styles.stockInfo}>
              {product.currentStock > 0 ? (
                <span className={styles.stockAvailable}>
                  ✓ Disponible ({product.currentStock} unidades)
                </span>
              ) : (
                <span className={styles.stockUnavailable}>
                  Agotado
                </span>
              )}
            </div>
          )}
        </div>
        {/* #end-section */}
      </div>
    </div>
  );
}
// #end-component
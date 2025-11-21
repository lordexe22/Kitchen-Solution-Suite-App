/* src/components/ProductCard/ProductCard.tsx */
// #section imports
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ProductWithCalculatedPrice, Product } from '../../store/Products.types';
import { getStockStatus } from '../../store/Products.types';
import styles from './ProductCard.module.css';
// #end-section

// #interface ProductCardProps
interface ProductCardProps {
  product: ProductWithCalculatedPrice;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}
// #end-interface

// #component ProductCard
/**
 * Card de producto con capacidad de drag & drop.
 * Muestra imagen, nombre, descripción, precio y estado de stock.
 * Estilo inspirado en apps de delivery (Uber Eats, Rappi, etc).
 */
export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onClick
}: ProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting
  } = useSortable({ 
    id: product.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSorting ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  // #const stockStatus
  // Crear un objeto Product temporal para getStockStatus (necesita images como string)
  const productForStockCheck: Product = {
    ...product,
    images: product.images.length > 0 ? JSON.stringify(product.images) : null
  };
  const stockStatus = getStockStatus(productForStockCheck);
  // #end-const

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.productCard} ${isDragging ? styles.dragging : ''} ${!product.isAvailable ? styles.unavailable : ''}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Drag Handle */}
      <div
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
      >
        <span className={styles.dragIcon}>⋮⋮</span>
      </div>

      {/* Product Content */}
      <div className={styles.productContent}>
        {/* Product Image */}
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className={styles.productImage}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Sin+Imagen';
            }}
          />
        ) : (
          <div className={styles.productImagePlaceholder}>
            📦
          </div>
        )}

        {/* Product Info */}
        <div className={styles.productInfo}>
          <h5 className={styles.productName}>{product.name}</h5>
          
          {product.description && (
            <p className={styles.productDescription}>
              {product.description}
            </p>
          )}

          {/* Price Section */}
          <div className={styles.priceSection}>
            {product.hasDiscount ? (
              <>
                <span className={styles.finalPrice}>
                  ${product.finalPrice.toFixed(2)}
                </span>
                <span className={styles.originalPrice}>
                  ${parseFloat(product.basePrice).toFixed(2)}
                </span>
                <span className={styles.discountBadge}>
                  -{product.discount}%
                </span>
              </>
            ) : (
              <span className={styles.finalPrice}>
                ${parseFloat(product.basePrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Section */}
          {product.hasStockControl && (
            <div className={styles.stockSection}>
              {stockStatus === 'ok' && (
                <span className={`${styles.stockBadge} ${styles.stockOk}`}>
                  Stock: {product.currentStock}
                </span>
              )}
              {stockStatus === 'low' && (
                <span className={`${styles.stockBadge} ${styles.stockLow}`}>
                  Stock bajo: {product.currentStock}
                </span>
              )}
              {stockStatus === 'critical' && (
                <span className={`${styles.stockBadge} ${styles.stockCritical}`}>
                  Stock crítico: {product.currentStock}
                </span>
              )}
            </div>
          )}

          {/* Unavailable Badge */}
          {!product.isAvailable && (
            <span className={styles.unavailableBadge}>
              No disponible
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.productActions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Editar producto"
          >
            ✏️
          </button>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
// #end-component
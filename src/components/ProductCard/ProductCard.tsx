/* src/components/ProductCard/ProductCard.tsx */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ProductWithCalculatedPrice, Product } from '../../store/Products.types';
import { getStockStatus } from '../../store/Products.types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ProductWithCalculatedPrice;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isDraggable?: boolean;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onClick,
  isDraggable = true
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

  const productForStockCheck: Product = {
    ...product,
    images: product.images.length > 0 ? JSON.stringify(product.images) : null,
    tags: product.tags ? JSON.stringify(product.tags) : null
  };
  const stockStatus = getStockStatus(productForStockCheck);

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
      {isDraggable && (
        <div
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
        >
          <span className={styles.dragIcon}>⋮⋮</span>
        </div>
      )}

      <div className={styles.productContent}>
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

        <div className={styles.productInfo}>
          <h5 className={styles.productName}>{product.name}</h5>
          
          {product.description && (
            <p className={styles.productDescription}>
              {product.description}
            </p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {product.tags.map((tag) => (
                <span
                  key={tag.name}
                  className={styles.tag}
                  style={{
                    backgroundColor: tag.backgroundColor,
                    color: tag.textColor,
                    border: tag.hasBorder ? `2px solid ${tag.textColor}` : 'none',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontWeight: 500
                  }}
                >
                  {tag.icon && <span style={{ marginRight: '0.25rem' }}>{tag.icon}</span>}
                  {tag.name}
                </span>
              ))}
            </div>
          )}

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

          {!product.isAvailable && (
            <span className={styles.unavailableBadge}>
              No disponible
            </span>
          )}
        </div>

        <div className={styles.productActions}>
          {onEdit && (
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
          )}
          {onDelete && (
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
          )}
        </div>
      </div>
    </div>
  );
}
/* src/pages/public/ProductDetailPage/ProductDetailPage.tsx */
// #section Imports
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail } from '../../../services/public/menu.service';
import type { PublicProductDetail } from '../../../services/public/menu.types';
import { processProduct } from '../../../store/Products.types';
import styles from './ProductDetailPage.module.css';
// #end-section

// #component ProductDetailPage
/**
 * Página pública de detalle de producto.
 * Muestra información completa del producto seleccionado.
 */
export default function ProductDetailPage() {
  const { branchId, tableNumber, productId } = useParams<{ 
    branchId: string; 
    tableNumber: string; 
    productId: string;
  }>();
  const navigate = useNavigate();

  const [productDetail, setProductDetail] = useState<PublicProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // #effect - Cargar detalle del producto
  useEffect(() => {
    const loadProductDetail = async () => {
      if (!productId) {
        setError('ID de producto no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getProductDetail(Number(productId));
        setProductDetail(data);
        setError(null);
      } catch (err) {
        console.error('Error loading product detail:', err);
        setError('Error al cargar el producto. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [productId]);
  // #end-effect

  // #function parseImages
  /**
   * Parsea el campo images de JSON string a array.
   */
  const parseImages = (): string[] => {
    if (!productDetail?.product.images) return [];
    try {
      return typeof productDetail.product.images === 'string'
        ? JSON.parse(productDetail.product.images)
        : productDetail.product.images;
    } catch {
      return [];
    }
  };
  // #end-function

  // #function handleBack
  /**
   * Vuelve a la página del menú.
   */
  const handleBack = () => {
    navigate(`/branch/${branchId}/table/${tableNumber}`);
  };
  // #end-function

  // #function handleImageChange
  /**
   * Cambia la imagen principal.
   */
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };
  // #end-function

  // #section Render loading
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando producto...</div>
      </div>
    );
  }
  // #end-section

  // #section Render error
  if (error || !productDetail) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'No se pudo cargar el producto'}
        </div>
        <button onClick={handleBack} className={styles.backButton}>
          Volver al menú
        </button>
      </div>
    );
  }
  // #end-section

  const { product, category } = productDetail;
  const images = parseImages();
  const currentImage = images[currentImageIndex];
  const processedProduct = processProduct(product);
  
  // Calcular precios para mostrar
  const displayPrice = processedProduct.finalPrice.toFixed(2);
  const originalPrice = processedProduct.hasDiscount 
    ? parseFloat(product.basePrice).toFixed(2) 
    : null;

  // #section Render main content
  return (
    <div className={styles.container}>
      {/* Header con botón de volver */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Volver al menú
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.productContainer}>
          {/* Sección de imágenes */}
          <div className={styles.imageSection}>
            {images.length > 0 ? (
              <>
                {/* Imagen principal */}
                <div className={styles.mainImageContainer}>
                  <img
                    src={currentImage}
                    alt={product.name}
                    className={styles.mainImage}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
                    }}
                  />
                </div>

                {/* Miniaturas (si hay más de una imagen) */}
                {images.length > 1 && (
                  <div className={styles.thumbnailsContainer}>
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`${styles.thumbnail} ${
                          index === currentImageIndex ? styles.thumbnailActive : ''
                        }`}
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

          {/* Sección de información */}
          <div className={styles.infoSection}>
            {/* Categoría */}
            <div className={styles.categoryBadge}>
              {category.name}
            </div>

            {/* Nombre del producto */}
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Precio */}
            <div className={styles.priceSection}>
              {processedProduct.hasDiscount ? (
                <>
                  <span className={styles.finalPrice}>${displayPrice}</span>
                  <span className={styles.originalPrice}>${originalPrice}</span>
                  <span className={styles.discountBadge}>
                    -{product.discount}% OFF
                  </span>
                </>
              ) : (
                <span className={styles.finalPrice}>${displayPrice}</span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div className={styles.descriptionSection}>
                <h2 className={styles.sectionTitle}>Descripción</h2>
                <p className={styles.description}>{product.description}</p>
              </div>
            )}

            {/* Estado de disponibilidad */}
            <div className={styles.availabilitySection}>
              {product.isAvailable ? (
                <div className={styles.available}>
                  <span className={styles.availableIcon}>✓</span>
                  <span>Disponible</span>
                </div>
              ) : (
                <div className={styles.unavailable}>
                  <span className={styles.unavailableIcon}>✕</span>
                  <span>No disponible</span>
                </div>
              )}
            </div>

            {/* Información de stock (si tiene control de stock) */}
            {product.hasStockControl && product.currentStock !== null && (
              <div className={styles.stockSection}>
                <h3 className={styles.sectionTitle}>Stock</h3>
                {product.currentStock > 0 ? (
                  <p className={styles.stockAvailable}>
                    {product.currentStock} unidades disponibles
                  </p>
                ) : (
                  <p className={styles.stockUnavailable}>Agotado</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
  // #end-section
}
// #end-component
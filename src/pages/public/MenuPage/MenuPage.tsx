/* src/pages/public/MenuPage/MenuPage.tsx */
// #section Imports
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBranchMenu, getBranchInfo } from '../../../services/public/menu.service';
import type { PublicBranchMenu, PublicBranchInfo } from '../../../services/public/menu.types';
import type { Product } from '../../../store/Products.types';
import { processProduct } from '../../../store/Products.types';
import styles from './MenuPage.module.css';
// #end-section

// #component MenuPage
/**
 * Página pública del menú para comensales.
 * Muestra categorías expandibles con productos.
 * Accesible vía QR sin autenticación.
 */
export default function MenuPage() {
  const { branchId, tableNumber } = useParams<{ branchId: string; tableNumber: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<PublicBranchMenu | null>(null);
  const [branchInfo, setBranchInfo] = useState<PublicBranchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // #effect - Cargar menú e información de sucursal
  useEffect(() => {
    const loadData = async () => {
      if (!branchId) {
        setError('ID de sucursal no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [menuData, infoData] = await Promise.all([
          getBranchMenu(Number(branchId)),
          getBranchInfo(Number(branchId))
        ]);
        
        setMenu(menuData);
        setBranchInfo(infoData);
        setError(null);
      } catch (err) {
        console.error('Error loading menu:', err);
        setError('Error al cargar el menú. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [branchId]);
  // #end-effect

  // #function toggleCategory
  /**
   * Expande o colapsa una categoría.
   */
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  // #end-function

  // #function handleProductClick
  /**
   * Navega al detalle del producto.
   */
  const handleProductClick = (productId: number) => {
    navigate(`/branch/${branchId}/table/${tableNumber}/product/${productId}`);
  };
  // #end-function

  // #function parseImages
  /**
   * Parsea el campo images de JSON string a array.
   */
  const parseImages = (product: Product): string[] => {
    if (!product.images) return [];
    try {
      return typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images;
    } catch {
      return [];
    }
  };
  // #end-function

  // #section Render loading
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando menú...</div>
      </div>
    );
  }
  // #end-section

  // #section Render error
  if (error || !menu || !branchInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'No se pudo cargar el menú'}
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render main content
  return (
    <div className={styles.container}>
      {/* Header con logo y nombre de la compañía */}
      <header className={styles.header}>
        {branchInfo.company.logoUrl && (
          <img 
            src={branchInfo.company.logoUrl} 
            alt={branchInfo.company.name}
            className={styles.logo}
          />
        )}
        <h1 className={styles.companyName}>{branchInfo.company.name}</h1>
        {menu.branch.name && (
          <p className={styles.branchName}>{menu.branch.name}</p>
        )}
      </header>

      {/* Categorías con productos */}
      <main className={styles.main}>
        {menu.categories.length === 0 ? (
          <div className={styles.emptyMenu}>
            No hay productos disponibles en este momento.
          </div>
        ) : (
          <div className={styles.categoriesContainer}>
            {menu.categories.map(category => {
              console.log('Categoría:', category.name, {
                backgroundMode: category.backgroundMode,
                backgroundColor: category.backgroundColor,
                gradientConfig: category.gradientConfig,
                textColor: category.textColor
              });
              const isExpanded = expandedCategories.has(category.id);
              // Generar gradiente CSS si corresponde
              let backgroundStyle = category.backgroundColor;
              if (category.backgroundMode === 'gradient' && category.gradientConfig) {
                try {
                  const grad = JSON.parse(category.gradientConfig);
                  if (grad.type === 'linear' && grad.colors && grad.colors.length > 1) {
                    backgroundStyle = `linear-gradient(${grad.angle ?? 135}deg, ${grad.colors.join(', ')})`;
                  }
                } catch (e) {
                  backgroundStyle = category.backgroundColor;
                }
              }
              const categoryStyle = {
                background: backgroundStyle,
                color: category.textColor
              };

              return (
                <div key={category.id} className={styles.category}>
                  {/* Banner de categoría (acordeón) */}
                  <button
                    className={styles.categoryBanner}
                    style={categoryStyle}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {/* Flecha primero, alineada a la izquierda */}
                    <span className={styles.expandIcon}>
                      {isExpanded ? '▼' : '▶'}
                    </span>

                    {/* Título y descripción */}
                    <div className={styles.categoryText}>
                      <h2 className={styles.categoryName}>{category.name}</h2>
                      {category.description && (
                        <p className={styles.categoryDescription}>
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Imagen/Icono de categoría al final, pegada a la derecha */}
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className={styles.categoryImage}
                      />
                    )}
                  </button>

                  {/* Lista de productos (expandible) */}
                  {isExpanded && (
                    <div className={styles.productsContainer}>
                      {category.products.length === 0 ? (
                        <p className={styles.emptyCategory}>
                          No hay productos en esta categoría
                        </p>
                      ) : (
                        <div className={styles.productsList}>
                          {category.products.map(product => {
                            const images = parseImages(product);
                            const mainImage = images[0];
                            const processedProduct = processProduct(product);
                            
                            // Calcular precios para mostrar
                            const displayPrice = processedProduct.finalPrice.toFixed(2);
                            const originalPrice = processedProduct.hasDiscount 
                              ? parseFloat(product.basePrice).toFixed(2) 
                              : null;

                            return (
                              <button
                                key={product.id}
                                className={`${styles.productCard} ${!product.isAvailable ? styles.unavailable : ''}`}
                                onClick={() => handleProductClick(product.id)}
                                disabled={!product.isAvailable}
                              >
                                {/* Imagen del producto */}
                                {mainImage ? (
                                  <img 
                                    src={mainImage} 
                                    alt={product.name}
                                    className={styles.productImage}
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                                    }}
                                  />
                                ) : (
                                  <div className={styles.noImage}>📦</div>
                                )}

                                {/* Info del producto */}
                                <div className={styles.productInfo}>
                                  <h3 className={styles.productName}>
                                    {product.name}
                                  </h3>
                                  
                                  {product.description && (
                                    <p className={styles.productDescription}>
                                      {product.description.length > 80 
                                        ? `${product.description.slice(0, 80)}...` 
                                        : product.description
                                      }
                                    </p>
                                  )}

                                  {/* Precio */}
                                  <div className={styles.priceContainer}>
                                    {processedProduct.hasDiscount ? (
                                      <>
                                        <span className={styles.finalPrice}>
                                          ${displayPrice}
                                        </span>
                                        <span className={styles.originalPrice}>
                                          ${originalPrice}
                                        </span>
                                      </>
                                    ) : (
                                      <span className={styles.finalPrice}>
                                        ${displayPrice}
                                      </span>
                                    )}
                                  </div>

                                  {/* Badge de agotado */}
                                  {!product.isAvailable && (
                                    <span className={styles.unavailableBadge}>
                                      Agotado
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer con horarios y redes sociales */}
      <footer className={styles.footer}>
        {/* Horarios */}
        {branchInfo.schedules.length > 0 && (
          <div className={styles.schedules}>
            <h3>Horarios de Atención</h3>
            <ul>
              {branchInfo.schedules.map(schedule => (
                <li key={schedule.id}>
                  <strong>{schedule.dayOfWeek}:</strong>{' '}
                  {schedule.isClosed 
                    ? 'Cerrado' 
                    : `${schedule.openTime} - ${schedule.closeTime}`
                  }
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Redes sociales */}
        {branchInfo.socials.length > 0 && (
          <div className={styles.socials}>
            <h3>Redes Sociales</h3>
            <div className={styles.socialLinks}>
              {branchInfo.socials.map(social => (
                <a 
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
  // #end-section
}
// #end-component
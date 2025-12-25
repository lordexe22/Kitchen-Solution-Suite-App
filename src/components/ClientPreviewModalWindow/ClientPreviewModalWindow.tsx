/* src/components/ClientPreviewModalWindow/ClientPreviewModalWindow.tsx */
// #section imports
import { useEffect, useMemo, useState } from 'react';
import styles from './ClientPreviewModalWindow.module.css';
import type { ClientPreviewModalWindowProps } from './ClientPreviewModalWindow.types';
import type { PublicBranchMenu, PublicBranchInfo } from '../../services/public/menu.types';
import { getBranchMenu, getBranchInfo } from '../../services/public/menu.service';
import { calculateProductPrice } from '../../store/Products.types';
import type { ProductWithCalculatedPrice } from '../../store/Products.types';
import ProductDetailModal from '../ProductDetailModal/ProductDetailModal';
import ProductCard from '../ProductCard/ProductCard';
import { generateBackgroundCSS } from '../../modules/categoryCreator/categoryCreator.utils';
import type { CategoryConfiguration } from '../../modules/categoryCreator/categoryCreator.types';
// #end-section

// #component ClientPreviewModalWindow
/**
 * Modal que simula la vista móvil del cliente para una sucursal.
 * Muestra categorías como acordeón y productos dentro de cada una.
 */
export default function ClientPreviewModalWindow({ isOpen, onClose, branchId }: ClientPreviewModalWindowProps) {
  // #state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PublicBranchMenu | null>(null);
  const [branchInfo, setBranchInfo] = useState<PublicBranchInfo | null>(null);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<number>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCalculatedPrice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  // #end-state

  // #effect - carga de menú público
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const [menu, info] = await Promise.all([
          getBranchMenu(branchId),
          getBranchInfo(branchId)
        ]);
        if (!isMounted) return;
        setData(menu);
        setBranchInfo(info);
        // todas las categorías inician colapsadas
        setExpandedCategoryIds(new Set());
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al cargar el menú público');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [isOpen, branchId]);
  // #end-effect

  // #function toggleCategory
  const toggleCategory = (categoryId: number) => {
    setExpandedCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId); else next.add(categoryId);
      return next;
    });
  };
  // #end-function

  // #function openProductDetail
  const openProductDetail = (product: ProductWithCalculatedPrice) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };
  // #end-function

  const closeProductDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const processedCategories = useMemo(() => {
    if (!data) return [];
    return data.categories.map(cat => ({
      ...cat,
      products: cat.products
        .map(p => ({
          ...p,
          images: p.images ? JSON.parse(p.images) : [],
          mainImage: p.images ? (JSON.parse(p.images)[0] ?? null) : null,
          tags: p.tags ? JSON.parse(p.tags) : null,
        }))
        .map(calculateProductPrice)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="client-preview-title" onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.statusBar} />
        <div className={styles.header}>
          <h2 id="client-preview-title" className={styles.title}>Vista de cliente</h2>
          <button className={styles.closeBtn} onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Cerrar">×</button>
        </div>

        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          {loading && <div className={styles.loading}>Cargando menú...</div>}
          {error && <div className={styles.errorMessage}>❌ {error}</div>}

          {!loading && !error && data && branchInfo && (
            <>
              {/* Info de la compañía */}
              <div className={styles.branchInfo}>
                {branchInfo.company.logoUrl && (
                  <img
                    src={branchInfo.company.logoUrl}
                    alt={branchInfo.company.name}
                    className={styles.companyLogo}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <strong>{branchInfo.company.name}</strong>
              </div>

              {/* Categorías en acordeón */}
              <div>
                {processedCategories.map(category => {
                  // Construir configuración como en el editor para reutilizar el mismo CSS
                  let gradient: CategoryConfiguration['gradient'] | undefined;
                  if (category.backgroundMode === 'gradient' && category.gradientConfig) {
                    try {
                      gradient = JSON.parse(category.gradientConfig);
                    } catch (err) {
                      console.warn('Error al parsear gradientConfig en vista cliente:', err);
                    }
                  }
                  const categoryConfig: CategoryConfiguration = {
                    name: category.name,
                    description: category.description ?? undefined,
                    imageUrl: category.imageUrl ?? undefined,
                    textColor: category.textColor,
                    backgroundMode: category.backgroundMode,
                    backgroundColor: category.backgroundColor,
                    gradient
                  };
                  const isOpen = expandedCategoryIds.has(category.id);
                  return (
                    <div key={category.id} className={styles.categoryItem}>
                      <div 
                        className={styles.categoryHeader}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                        style={{ background: generateBackgroundCSS(categoryConfig), color: category.textColor }}
                      >
                        {/* Flecha primero, alineada a la izquierda */}
                        <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}>▶</span>

                        {/* Título y descripción inmediatamente después de la flecha */}
                        <div className={styles.categoryTitle}>
                          <div className={styles.categoryInfo}>
                            <h4 className={styles.categoryName}>{category.name}</h4>
                            {category.description && (
                              <p className={styles.categoryDescription}>{category.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Imagen/Icono de categoría al final, pegada a la derecha */}
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className={styles.categoryImage}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>

                      {isOpen && (
                        <div className={styles.productsList}>
                          {category.products.length === 0 ? (
                            <div className={styles.emptyMessage}>No hay productos en esta sección.</div>
                          ) : (
                            category.products.map(prod => (
                              <div key={prod.id} onClick={(e) => e.stopPropagation()}>
                                <ProductCard
                                  product={prod}
                                  isDraggable={false}
                                  onClick={() => openProductDetail(prod)}
                                />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <ProductDetailModal isOpen={isDetailModalOpen} onClose={closeProductDetail} product={selectedProduct} />
    </div>
  );
}
// #end-component
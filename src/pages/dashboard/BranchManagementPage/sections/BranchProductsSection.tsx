// src/pages/dashboard/BranchManagementPage/sections/BranchProductsSection.tsx

import { useEffect, useState, useRef } from 'react';
import BranchAccordion from '../../../../components/BranchAccordion/BranchAccordion';
import DraggableCategory from '../../../../components/DraggableCategory/DraggableCategory';
import ProductDetailModal from '../../../../components/ProductDetailModal/ProductDetailModal';
import ProductCard from '../../../../components/ProductCard/ProductCard';
import ProductFormModal from '../../../../components/ProductFormModal/ProductFormModal';
import { CategoryCreatorModal } from '../../../../modules/categoryCreator';
import type { CategoryConfiguration } from '../../../../modules/categoryCreator';
import type { CategoryWithParsedGradient } from '../../../../store/Categories.types';
import type { ProductWithCalculatedPrice, ProductFormData } from '../../../../store/Products.types';
import { calculateProductPrice } from '../../../../store/Products.types';
import { useBranches } from '../../../../hooks/useBranches';
import { useCategories } from '../../../../hooks/useCategories';
import { useProducts } from '../../../../hooks/useProducts';
import { uploadProductImages, deleteProductImage } from '../../../../services/products/productsImages.service';
import { uploadCategoryImage } from '../../../../services/categories/categoryImage.service';
import { importCategory } from '../../../../services/categories/categories.service';
import type { BranchSectionProps } from '../BranchManagementPage.types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from '../BranchManagementPage.module.css';

// #component BranchProductsSection
/**
 * Componente que maneja la sección de productos y categorías por sucursal.
 * Si filterByBranchId está presente, solo muestra esa sucursal (modo employee).
 */
const BranchProductsSection = ({ companyId, filterByBranchId }: BranchSectionProps) => {
  // #hook useBranches
  const { branches, isLoading: isLoadingBranches, loadBranches } = useBranches(companyId);
  // #end-hook

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #section return
  return (
    <>
      <div className={styles.branchesSection}>
        {/* #section Header */}
        <div className={styles.branchesHeader}>
          <h4 className={styles.sectionTitle}>Sucursales</h4>
        </div>
        {/* #end-section */}

        {/* #section Loading state */}
        {isLoadingBranches && branches.length === 0 && <p className={styles.loading}>Cargando sucursales...</p>}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoadingBranches && branches.length === 0 && (
          <p className={styles.emptyMessage}>No hay sucursales en esta compañía.</p>
        )}
        {/* #end-section */}

        {/* #section Branch list */}
        {branches.length > 0 && (
          <div className={styles.branchList}>
            {branches
              .filter(branch => !filterByBranchId || branch.id === filterByBranchId)
              .map((branch, index) => (
              <BranchAccordion key={branch.id} branch={branch} displayIndex={index + 1} expandable={true}>
                <BranchProductsContainer branchId={branch.id} />
              </BranchAccordion>
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>
    </>
  );
};

export default BranchProductsSection;

// #component BranchProductsContainer
/**
 * Contenedor de productos y categorías de una sucursal.
 */
function BranchProductsContainer({ branchId }: { branchId: number }) {
  const [categories, setCategories] = useState<CategoryWithParsedGradient[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    category: CategoryWithParsedGradient;
    index: number;
  } | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // #hook useCategories
  const { categories: categoriesFromStore, isLoading, loadCategories, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategories(branchId);
  // #end-hook

  // #effect - Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  // #end-effect

  // #effect - Sincronizar categorías del store con el estado local
  useEffect(() => {
    setCategories(categoriesFromStore);
  }, [categoriesFromStore]);
  // #end-effect

  // #sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // #end-sensors

  const categoryToConfiguration = (category: CategoryWithParsedGradient): CategoryConfiguration => {
    return {
      name: category.name,
      description: category.description || undefined,
      imageUrl: category.imageUrl || undefined,
      textColor: category.textColor,
      backgroundMode: category.backgroundMode,
      backgroundColor: category.backgroundColor,
      gradient: category.gradient,
    };
  };

  const configurationToFormData = (config: CategoryConfiguration) => {
    return {
      name: config.name,
      description: config.description || undefined,
      imageUrl: config.imageUrl || undefined,
      textColor: config.textColor,
      backgroundMode: config.backgroundMode,
      backgroundColor: config.backgroundColor,
      gradient: config.gradient,
    };
  };

  const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleOpenEditModal = (category: CategoryWithParsedGradient, index: number) => {
    setEditingCategory({ category, index });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (config: CategoryConfiguration) => {
    try {
      const { imageUrl, ...categoryData } = configurationToFormData(config);
      const isBase64Image = imageUrl?.startsWith('data:image/');

      let savedCategory;

      if (editingCategory) {
        savedCategory = await updateCategory(editingCategory.category.id, categoryData);

        if (isBase64Image && imageUrl) {
          const file = await base64ToFile(imageUrl, 'category-image.jpg');
          const imageResult = await uploadCategoryImage(savedCategory.id, file);
          savedCategory = await updateCategory(savedCategory.id, { imageUrl: imageResult.imageUrl });
        }
      } else {
        savedCategory = await createCategory(categoryData);

        if (isBase64Image && imageUrl) {
          const file = await base64ToFile(imageUrl, 'category-image.jpg');
          const imageResult = await uploadCategoryImage(savedCategory.id, file);
          savedCategory = await updateCategory(savedCategory.id, { imageUrl: imageResult.imageUrl });
        } else if (imageUrl) {
          savedCategory = await updateCategory(savedCategory.id, { imageUrl });
        }
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría. Por favor intenta de nuevo.');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría. Por favor intenta de nuevo.');
    }
  };

  // #event handleImportCategory
  /**
   * Maneja la importación de una categoría desde un archivo Excel.
   */
  const handleImportCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validar extensión
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      alert('Por favor selecciona un archivo Excel (.xlsx)');
      return;
    }

    setIsImporting(true);

    try {
      const result = await importCategory(branchId, file);

      // Mostrar resumen de la importación
      const message = [
        '✅ Categoría importada exitosamente',
        '',
        `📦 Categoría: ${result.summary.categoryName}`,
        `📝 Productos importados: ${result.summary.productsImported}`,
      ];

      if (result.summary.wasRenamed) {
        message.push('', `ℹ️ Nota: Se renombró de "${result.summary.originalName}" para evitar duplicados`);
      }

      alert(message.join('\n'));

      // Recargar categorías para mostrar la nueva
      await loadCategories(true);

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error importing category:', error);
      alert(`Error al importar la categoría:\n\n${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsImporting(false);
    }
  };
  // #end-event

  // #event handleClickImport
  /**
   * Trigger del input file al hacer click en el botón.
   */
  const handleClickImport = () => {
    fileInputRef.current?.click();
  };
  // #end-event

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);

    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);

    const updates = reordered.map((cat, index) => ({
      id: cat.id,
      sortOrder: index + 1,
    }));

    try {
      await reorderCategories(updates);
    } catch (error) {
      console.error('Error reordering categories:', error);
      alert('Error al reordenar. Se revertirán los cambios.');
      loadCategories(true);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getActiveCategory = () => {
    if (!activeId) return null;
    return categories.find((cat) => cat.id === activeId);
  };

  return (
    <div className={styles.categoriesContainer}>
      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          className="btn-pri btn-sm" 
          onClick={handleOpenCreateModal} 
          disabled={isLoading || isImporting}
        >
          + Nueva Categoría
        </button>

        <button 
          className="btn-sec btn-sm" 
          onClick={handleClickImport}
          disabled={isLoading || isImporting}
        >
          {isImporting ? '⏳ Importando...' : '📥 Importar Categoría'}
        </button>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleImportCategory}
          style={{ display: 'none' }}
        />
      </div>

      {isLoading && categories.length === 0 && <p className={styles.loading}>Cargando categorías...</p>}

      {categories.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={categories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.categoriesList}>
              {categories.map((category) => (
                <DraggableCategory
                  key={category.id}
                  category={category}
                  onEdit={() => handleOpenEditModal(category, categories.indexOf(category))}
                  onDelete={() => handleDeleteCategory(category.id)}
                >
                  <BranchProductsInCategory categoryId={category.id} />
                </DraggableCategory>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <DraggableCategory category={getActiveCategory()!} onEdit={() => {}} onDelete={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {showCategoryModal && (
        <CategoryCreatorModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onConfirm={handleSaveCategory}
          initialConfig={editingCategory ? categoryToConfiguration(editingCategory.category) : undefined}
          title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          confirmText={editingCategory ? 'Guardar' : 'Crear'}
        />
      )}
    </div>
  );
}

// #component BranchProductsInCategory
/**
 * Sección de productos de una categoría dentro de la rama.
 */
function BranchProductsInCategory({ categoryId }: { categoryId: number }) {
  const [products, setProducts] = useState<ProductWithCalculatedPrice[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCalculatedPrice | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCalculatedPrice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // #hook useProducts
  const { products: productsFromStore, isLoading, loadProducts, createProduct, updateProduct, deleteProduct, reorderProducts } = useProducts(categoryId);
  // #end-hook

  // #effect - Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  // #end-effect

  // #effect - Sincronizar productos del store con el estado local
  useEffect(() => {
    const processed = productsFromStore.map((product) => calculateProductPrice(product));
    setProducts(processed);
  }, [productsFromStore]);
  // #end-effect

  // #sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // #end-sensors

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product: ProductWithCalculatedPrice) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  // ==========================================
  // FUNCIÓN: handleSaveProduct
  // ==========================================
  const handleSaveProduct = async (data: Omit<ProductFormData, 'categoryId'>, currentImages: string[]) => {
    try {
      let createdOrUpdatedProduct;

      if (editingProduct) {
        // === MODO EDICIÓN ===
        
        // 1. Obtener imágenes originales del producto
        const originalImages = editingProduct.images || [];
        
        // 2. Identificar imágenes eliminadas
        const deletedImages = originalImages.filter((img) => !currentImages.includes(img));

        // 3. Identificar nuevas imágenes (base64)
        const newImages = currentImages.filter((img) => img.startsWith('data:image/'));

        // 4. Actualizar datos del producto (sin imágenes por ahora)
        createdOrUpdatedProduct = await updateProduct(editingProduct.id, data);

        // 5. Eliminar imágenes obsoletas de Cloudinary
        for (const imageUrl of deletedImages) {
          try {
            await deleteProductImage(editingProduct.id, imageUrl);
          } catch (error) {
            console.warn('Error eliminando imagen:', error);
          }
        }

        // 6. Subir nuevas imágenes y obtener URLs
        let uploadedUrls: string[] = [];
        if (newImages.length > 0) {
          const files = await Promise.all(
            newImages.map(async (dataUrl) => {
              const response = await fetch(dataUrl);
              const blob = await response.blob();
              return new File([blob], 'product-image.jpg', { type: blob.type });
            })
          );

          const uploadResult = await uploadProductImages(editingProduct.id, files);
          uploadedUrls = uploadResult.uploadedImages;
        }

        // 7. Construir array final de imágenes
        const existingImages = currentImages.filter((img) => !img.startsWith('data:image/'));
        const finalImages = [...existingImages, ...uploadedUrls];

        // 8. Actualizar producto con las nuevas imágenes
        createdOrUpdatedProduct = await updateProduct(editingProduct.id, {
          images: finalImages,
        });
      } else {
        // === MODO CREACIÓN ===
        
        // 1. Crear producto sin imágenes
        createdOrUpdatedProduct = await createProduct(data);

        // 2. Si hay imágenes, subirlas
        if (currentImages.length > 0) {
          const files = await Promise.all(
            currentImages.map(async (dataUrl) => {
              const response = await fetch(dataUrl);
              const blob = await response.blob();
              return new File([blob], 'product-image.jpg', { type: blob.type });
            })
          );

          const uploadResult = await uploadProductImages(createdOrUpdatedProduct.id, files);

          // 3. Actualizar producto con URLs de Cloudinary
          createdOrUpdatedProduct = await updateProduct(createdOrUpdatedProduct.id, {
            images: uploadResult.uploadedImages,
          });
        }
      }

      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Por favor intenta de nuevo.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto. Por favor intenta de nuevo.');
    }
  };

  const handleProductClick = (product: ProductWithCalculatedPrice) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(products, oldIndex, newIndex);
    setProducts(reordered);

    const updates = reordered.map((product, index) => ({
      id: product.id,
      sortOrder: index,
    }));

    try {
      await reorderProducts(updates);
      console.log('✅ Productos reordenados exitosamente');
    } catch (error) {
      console.error('❌ Error reordering products:', error);
      alert('Error al reordenar. Se revertirán los cambios.');
      loadProducts();
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getActiveProduct = () => {
    if (!activeId) return null;
    return products.find((p) => p.id === activeId);
  };

  return (
    <div className={styles.productsSection}>
      <button className="btn-pri btn-sm" onClick={handleOpenCreateModal} disabled={isLoading}>
        + Nuevo Producto
      </button>

      {isLoading && products.length === 0 && <p className={styles.loading}>Cargando productos...</p>}
      {!isLoading && products.length === 0 && <p className={styles.emptyMessage}>No hay productos en esta categoría. Crea el primero.</p>}

      {products.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className={styles.productsList}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleOpenEditModal(product)}
                  onDelete={() => handleDeleteProduct(product.id)}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>{activeId ? <ProductCard product={getActiveProduct()!} onEdit={() => {}} onDelete={() => {}} /> : null}</DragOverlay>
        </DndContext>
      )}

      {showProductModal && (
        <ProductFormModal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSaveProduct}
          initialData={
            editingProduct
              ? {
                  name: editingProduct.name,
                  description: editingProduct.description || undefined,
                  basePrice: parseFloat(editingProduct.basePrice),
                  discount: editingProduct.discount ? parseFloat(editingProduct.discount) : undefined,
                  hasStockControl: editingProduct.hasStockControl,
                  currentStock: editingProduct.currentStock || undefined,
                  stockAlertThreshold: editingProduct.stockAlertThreshold || undefined,
                  stockStopThreshold: editingProduct.stockStopThreshold || undefined,
                  isAvailable: editingProduct.isAvailable,
                  images: editingProduct.images,
                  tags: editingProduct.tags || undefined,
                }
              : undefined
          }
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          submitText={editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
        />
      )}

      <ProductDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} product={selectedProduct} />
    </div>
  );
}

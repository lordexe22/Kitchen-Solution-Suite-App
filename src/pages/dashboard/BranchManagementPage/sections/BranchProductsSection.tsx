// src/pages/dashboard/BranchManagementPage/sections/BranchProductsSection.tsx

import { useEffect, useState } from 'react';
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
import { uploadProductImages } from '../../../../services/products/productsImages.service';
import { uploadCategoryImage } from '../../../../services/categories/categoryImage.service';
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
 */
const BranchProductsSection = ({ companyId }: BranchSectionProps) => {
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
            {branches.map((branch, index) => (
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
      console.log('✅ Categorías reordenadas exitosamente');
    } catch (error) {
      console.error('❌ Error reordering categories:', error);
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
      <button className="btn-pri btn-sm" onClick={handleOpenCreateModal} disabled={isLoading}>
        + Nueva Categoría
      </button>

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

  const handleSaveProduct = async (data: Omit<ProductFormData, 'categoryId'>, imageFiles: string[]) => {
    try {
      let createdOrUpdatedProduct;

      if (editingProduct) {
        createdOrUpdatedProduct = await updateProduct(editingProduct.id, data);
      } else {
        createdOrUpdatedProduct = await createProduct(data);
      }

      if (imageFiles.length > 0 && createdOrUpdatedProduct) {
        try {
          const files = await Promise.all(
            imageFiles.map(async (base64, index) => {
              const response = await fetch(base64);
              const blob = await response.blob();
              return new File([blob], `image-${index}.jpg`, { type: blob.type });
            })
          );

          await uploadProductImages(createdOrUpdatedProduct.id, files);
          await loadProducts(true);
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          alert('Producto creado, pero hubo un error al subir las imágenes');
        }
      }

      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
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

    const updates = reordered.map((p, index) => ({
      id: p.id,
      sortOrder: index + 1,
    }));

    try {
      await reorderProducts(updates);
    } catch (error) {
      console.error('Error reordering products:', error);
      alert('Error al reordenar. Se revertirán los cambios.');
      loadProducts(true);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleProductClick = (product: ProductWithCalculatedPrice) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  const getActiveProduct = () => {
    if (!activeId) return null;
    return products.find((p) => p.id === activeId);
  };

  return (
    <div className={styles.productsContainer}>
      <button className="btn-pri btn-sm" onClick={handleOpenCreateModal} disabled={isLoading}>
        + Nuevo Producto
      </button>

      {isLoading && products.length === 0 && <p className={styles.loading}>Cargando productos...</p>}

      {!isLoading && products.length === 0 && <p className={styles.emptyProducts}>No hay productos en esta categoría. Crea el primero.</p>}

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

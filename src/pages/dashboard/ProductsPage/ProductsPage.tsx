/* src/pages/dashboard/ProductsPage/ProductsPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import DraggableCategory from '../../../components/DraggableCategory/DraggableCategory';
import ProductDetailModal from '../../../components/ProductDetailModal/ProductDetailModal';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import { useCategories } from '../../../hooks/useCategories';
import { CategoryCreatorModal } from '../../../modules/categoryCreator';
import type { CategoryConfiguration } from '../../../modules/categoryCreator';
import type { CategoryWithParsedGradient } from '../../../store/Categories.types';
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
  type UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './ProductsPage.module.css';
import ProductCard from '../../../components/ProductCard/ProductCard';
import ProductFormModal from '../../../components/ProductFormModal/ProductFormModal';
import { useProducts } from '../../../hooks/useProducts';
import type { ProductWithCalculatedPrice } from '../../../store/Products.types';
import type { ProductFormData } from '../../../store/Products.types';
import { calculateProductPrice } from '../../../store/Products.types';
import { uploadProductImages } from '../../../services/products/productsImages.service';
// #end-section

// #component ProductsPage
/**
 * Página de gestión de productos y categorías.
 * Muestra compañías > sucursales > categorías.
 */
const ProductsPage = () => {
  // #variable appLogoUrl
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  // #end-variable

  // #hook useCompanies
  const { 
    companies, 
    loadCompanies, 
    isLoading: isLoadingCompanies 
  } = useCompanies();
  // #end-hook

  // #effect - Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-effect

  // #section return
  return (
    <div className={styles.container}>
      {/* #section AppHeader */}
      <AppHeader
        appLogoUrl={appLogoUrl}
        appName="Kitchen Solutions"
        onLogin={() => {}}
        onLogout={() => {}}
      />
      {/* #end-section */}

      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          {/* #section Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>🍽️ Productos y Categorías</h1>
            <p className={styles.subtitle}>
              Crea categorías para organizar tus productos por sucursal.
            </p>
          </div>
          {/* #end-section */}

          {/* #section Empty state - No companies */}
          {!isLoadingCompanies && companies.length === 0 && (
            <EmptyState 
              title="Sin compañías registradas" 
              description="Crea tu primera compañía en la sección de Compañías para comenzar." 
            />
          )}
          {/* #end-section */}

          {/* #section Company list */}
          {companies.length > 0 && (
            <div className={styles.companyList}>
              {companies.map((company) => (
                <CompanyAccordion
                  key={company.id}
                  company={company}
                >
                  <BranchList companyId={company.id} />
                </CompanyAccordion>
              ))}
            </div>
          )}
          {/* #end-section */}
        </main>
      </div>
    </div>
  );
  // #end-section
}
// #end-component

// #component BranchList
/**
 * Lista de sucursales de una compañía.
 */
function BranchList({ companyId }: { companyId: number }) {
  // #hook useBranches
  const {
    branches,
    isLoading,
    loadBranches
  } = useBranches(companyId);
  // #end-hook

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #section return
  return (
    <div className={styles.branchContainer}>
      {/* #section Loading state */}
      {isLoading && <p>Cargando sucursales...</p>}
      {/* #end-section */}

      {/* #section Empty state - No branches */}
      {!isLoading && branches.length === 0 && (
        <p className={styles.emptyBranches}>
          No hay sucursales. Crea sucursales en la sección de Compañías.
        </p>
      )}
      {/* #end-section */}

      {/* #section Branch list */}
      {branches.length > 0 && (
        <div className={styles.branchList}>
          {branches.map((branch, index) => (
            <BranchAccordion
              key={branch.id}
              branch={branch}
              displayIndex={index + 1}
              expandable={true}
            >
              <CategoriesContainer branchId={branch.id} />
            </BranchAccordion>
          ))}
        </div>
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
}
// #end-component

// #component CategoriesContainer
/**
 * Contenedor de categorías de una sucursal.
 * Maneja el CRUD de categorías usando el hook useCategories.
 */
function CategoriesContainer({ branchId }: { branchId: number }) {
  // #hook useCategories
  const {
    categories: categoriesFromStore,
    isLoading,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
  } = useCategories(branchId);
  // #end-hook
  // #state [localCategories, setLocalCategories] - Estado local para drag & drop optimista
  const [localCategories, setLocalCategories] = useState<CategoryWithParsedGradient[]>([]);
  // #end-state
  // #state [activeId, setActiveId] - ID del elemento que se está arrastrando
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // #end-state
  // #state [showCategoryModal, setShowCategoryModal]
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  // #end-state
  // #state [editingCategory, setEditingCategory]
  const [editingCategory, setEditingCategory] = useState<{
    category: CategoryWithParsedGradient;
    index: number;
  } | null>(null);
  // #end-state
  // #event - Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  // #end-event
  // #event - Sincronizar categorías del store con el estado local
  useEffect(() => {
    setLocalCategories(categoriesFromStore);
  }, [categoriesFromStore]);
  // #end-event
  // #variable - Configuración de sensores para drag & drop
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
  // #end-variable
  // #function getActiveCategory
  const getActiveCategory = () => {
    if (!activeId) return null;
    return localCategories.find(cat => cat.id === activeId);
  };
  // #end-function
  // #function categoryToConfiguration
  const categoryToConfiguration = (category: CategoryWithParsedGradient): CategoryConfiguration => {
    return {
      name: category.name,
      description: category.description || undefined,
      imageUrl: category.imageUrl || undefined,
      textColor: category.textColor,
      backgroundMode: category.backgroundMode,
      backgroundColor: category.backgroundColor,
      gradient: category.gradient
    };
  };
  // #end-function
  // #function configurationToFormData
  const configurationToFormData = (config: CategoryConfiguration) => {
    return {
      name: config.name,
      description: config.description || undefined,
      imageUrl: config.imageUrl || undefined,
      textColor: config.textColor,
      backgroundMode: config.backgroundMode,
      backgroundColor: config.backgroundColor,
      gradient: config.gradient
    };
  };
  // #end-function
  // #event handleOpenCreateModal
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };
  // #end-event
  // #event handleOpenEditModal
  const handleOpenEditModal = (category: CategoryWithParsedGradient, index: number) => {
    setEditingCategory({ category, index });
    setShowCategoryModal(true);
  };
  // #end-event
  // #event handleSaveCategory
  const handleSaveCategory = async (config: CategoryConfiguration) => {
    try {
      const formData = configurationToFormData(config);
      
      if (editingCategory) {
        await updateCategory(editingCategory.category.id, formData);
      } else {
        await createCategory(formData);
      }
      
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría. Por favor intenta de nuevo.');
    }
  };
  // #end-event
  // #event handleDeleteCategory
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría. Por favor intenta de nuevo.');
    }
  };
  // #end-event
  // #event handleDragStart
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  // #end-event
  // #event handleDragEnd
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localCategories.findIndex((cat) => cat.id === active.id);
    const newIndex = localCategories.findIndex((cat) => cat.id === over.id);

    const reordered = arrayMove(localCategories, oldIndex, newIndex);
    setLocalCategories(reordered);

    const updates = reordered.map((cat, index) => ({
      id: cat.id,
      sortOrder: index + 1
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
  // #end-event
  // #event handleDragCancel
  const handleDragCancel = () => {
    setActiveId(null);
  };
  // #end-event

  // #section return
  return (
    <div className={styles.categoriesContainer}>
      {/* #section Botón crear categoría */}
      <button
        className="btn-pri btn-sm"
        onClick={handleOpenCreateModal}
        disabled={isLoading}
      >
        + Nueva Categoría
      </button>
      {/* #end-section */}

      {/* #section Loading state */}
      {isLoading && localCategories.length === 0 && (
        <p className={styles.loading}>Cargando categorías...</p>
      )}
      {/* #end-section */}

      {/* #section Lista de categorías con drag & drop */}
      {localCategories.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={localCategories.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.categoriesList}>
              {localCategories.map((category) => (
                <DraggableCategory
                  key={category.id}
                  category={category}
                  onEdit={() => handleOpenEditModal(category, localCategories.indexOf(category))}
                  onDelete={() => handleDeleteCategory(category.id)}
                >
                  {/* Productos de esta categoría */}
                  <ProductsSection categoryId={category.id} />
                </DraggableCategory>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <DraggableCategory
                category={getActiveCategory()!}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      {/* #end-section */}

      {/* #section Modal de creación/edición */}
      {showCategoryModal && (
        <CategoryCreatorModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onConfirm={handleSaveCategory}
          initialConfig={
            editingCategory 
              ? categoryToConfiguration(editingCategory.category)
              : undefined
          }
          title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          confirmText={editingCategory ? 'Guardar' : 'Crear'}
        />
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
}
// #end-component

// #component ProductsSection
/**
 * Sección de productos de una categoría.
 * Maneja el CRUD de productos y drag & drop.
 */
function ProductsSection({ categoryId }: { categoryId: number }) {
  // #hook useProducts
  const {
    products: productsFromStore,
    isLoading,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reorderProducts
  } = useProducts(categoryId);
  // #end-hook

  // #state local
  const [localProducts, setLocalProducts] = useState<ProductWithCalculatedPrice[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCalculatedPrice | null>(null);
  // #end-state

  // #state - Modal de detalle de producto
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCalculatedPrice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // #end-state

  // #effect - Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  // #end-effect

  // #effect - Sincronizar productos del store con el estado local
  useEffect(() => {
    // productsFromStore ya viene con imágenes parseadas (ProductWithParsedImages)
    // Solo necesitamos calcular el precio
    const processed = productsFromStore.map(product => {
      // calculateProductPrice espera ProductWithParsedImages, que es lo que tenemos
      return calculateProductPrice(product);
    });
    setLocalProducts(processed);
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

  // #function getActiveProduct
  const getActiveProduct = () => {
    if (!activeId) return null;
    return localProducts.find(p => p.id === activeId);
  };
  // #end-function

  // #event handleOpenCreateModal
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };
  // #end-event

  // #event handleOpenEditModal
  const handleOpenEditModal = (product: ProductWithCalculatedPrice) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };
  // #end-event

  // #event handleSaveProduct
  const handleSaveProduct = async (data: Omit<ProductFormData, 'categoryId'>, imageFiles: string[]) => {
    try {
      let createdOrUpdatedProduct;
      
      if (editingProduct) {
        // Actualizar producto existente
        createdOrUpdatedProduct = await updateProduct(editingProduct.id, data);
      } else {
        // Crear nuevo producto
        createdOrUpdatedProduct = await createProduct(data);
      }

      // Si hay imágenes, subirlas
      if (imageFiles.length > 0 && createdOrUpdatedProduct) {
        try {
          // Convertir base64 a File objects
          const files = await Promise.all(
            imageFiles.map(async (base64, index) => {
              const response = await fetch(base64);
              const blob = await response.blob();
              return new File([blob], `image-${index}.jpg`, { type: blob.type });
            })
          );

          // Subir imágenes al backend
          await uploadProductImages(createdOrUpdatedProduct.id, files);
          
          // Recargar productos para obtener las URLs de Cloudinary
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
  // #end-event

  // #event handleDeleteProduct
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto. Por favor intenta de nuevo.');
    }
  };
  // #end-event

  // #event handleDragStart
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  // #end-event

  // #event handleDragEnd
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localProducts.findIndex((p) => p.id === active.id);
    const newIndex = localProducts.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(localProducts, oldIndex, newIndex);
    setLocalProducts(reordered);

    const updates = reordered.map((p, index) => ({
      id: p.id,
      sortOrder: index + 1
    }));

    try {
      await reorderProducts(updates);
    } catch (error) {
      console.error('Error reordering products:', error);
      alert('Error al reordenar. Se revertirán los cambios.');
      loadProducts(true);
    }
  };
  // #end-event

  // #event handleDragCancel
  const handleDragCancel = () => {
    setActiveId(null);
  };
  // #end-event

  // #function handleProductClick - Abrir modal de detalle
  const handleProductClick = (product: ProductWithCalculatedPrice) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };
  // #end-function

  // #function handleCloseDetailModal - Cerrar modal de detalle
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };
  // #end-function

  // #section return
  return (
    <div className={styles.productsContainer}>
      {/* Botón crear producto */}
      <button
        className="btn-pri btn-sm"
        onClick={handleOpenCreateModal}
        disabled={isLoading}
      >
        + Nuevo Producto
      </button>

      {/* Loading state */}
      {isLoading && localProducts.length === 0 && (
        <p className={styles.loading}>Cargando productos...</p>
      )}

      {/* Empty state */}
      {!isLoading && localProducts.length === 0 && (
        <p className={styles.emptyProducts}>
          No hay productos en esta categoría. Crea el primero.
        </p>
      )}

      {/* Lista de productos con drag & drop */}
      {localProducts.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={localProducts.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.productsList}>
              {localProducts.map((product) => (
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

          <DragOverlay>
            {activeId ? (
              <ProductCard
                product={getActiveProduct()!}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

    {/* Modal de creación/edición */}
    {showProductModal && (
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        initialData={editingProduct ? {
          name: editingProduct.name,
          description: editingProduct.description || undefined,
          basePrice: parseFloat(editingProduct.basePrice),
          discount: editingProduct.discount ? parseFloat(editingProduct.discount) : undefined,
          hasStockControl: editingProduct.hasStockControl,
          currentStock: editingProduct.currentStock || undefined,
          stockAlertThreshold: editingProduct.stockAlertThreshold || undefined,
          stockStopThreshold: editingProduct.stockStopThreshold || undefined,
          isAvailable: editingProduct.isAvailable,
          images: editingProduct.images // Ya es string[] (array)
        } : undefined}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        submitText={editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
      />
    )}

    {/* Modal de detalle de producto */}
    <ProductDetailModal
      isOpen={isDetailModalOpen}
      onClose={handleCloseDetailModal}
      product={selectedProduct}
    />
    </div>
  );
  // #end-section
}
// #end-component

export default ProductsPage;
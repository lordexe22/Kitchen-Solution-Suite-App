/* src/pages/dashboard/ProductsPage/ProductsPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import DraggableCategory from '../../../components/DraggableCategory/DraggableCategory';
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

  // #effect - Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  // #end-effect

  // #effect - Sincronizar categorías del store con el estado local
  useEffect(() => {
    setLocalCategories(categoriesFromStore);
  }, [categoriesFromStore]);
  // #end-effect

  // #sensors - Configuración de sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimiento antes de activar el drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // #end-sensors

  // #function getActiveCategory - Obtener la categoría que se está arrastrando
  const getActiveCategory = () => {
    if (!activeId) return null;
    return localCategories.find(cat => cat.id === activeId);
  };
  // #end-function

  // #function categoryToConfiguration
  /**
   * Convierte una Category del backend a CategoryConfiguration del modal.
   */
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
  /**
   * Convierte CategoryConfiguration a CategoryFormData para el backend.
   */
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
  /**
   * Abre modal para crear nueva categoría.
   */
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };
  // #end-event

  // #event handleOpenEditModal
  /**
   * Abre modal para editar categoría existente.
   */
  const handleOpenEditModal = (category: CategoryWithParsedGradient, index: number) => {
    setEditingCategory({ category, index });
    setShowCategoryModal(true);
  };
  // #end-event

  // #event handleSaveCategory
  /**
   * Guarda categoría (crear o editar).
   */
  const handleSaveCategory = async (config: CategoryConfiguration) => {
    try {
      const formData = configurationToFormData(config);
      
      if (editingCategory) {
        // Editar existente
        await updateCategory(editingCategory.category.id, formData);
      } else {
        // Crear nueva
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
  /**
   * Elimina una categoría.
   */
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
  /**
   * Se ejecuta cuando comienza el drag.
   * Guarda el ID del elemento que se está arrastrando.
   */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };
  // #end-event

  // #event handleDragEnd
  /**
   * Maneja el fin del drag & drop.
   * Actualiza el estado local inmediatamente para UX fluida,
   * luego persiste en el backend.
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Limpiar activeId
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localCategories.findIndex((cat) => cat.id === active.id);
    const newIndex = localCategories.findIndex((cat) => cat.id === over.id);

    // Actualizar estado local INMEDIATAMENTE
    const reordered = arrayMove(localCategories, oldIndex, newIndex);
    setLocalCategories(reordered);

    // Crear array de updates con los nuevos sortOrder
    const updates = reordered.map((cat, index) => ({
      id: cat.id,
      sortOrder: index + 1
    }));

    // Persistir en backend
    try {
      await reorderCategories(updates);
      console.log('✅ Categorías reordenadas exitosamente');
    } catch (error) {
      console.error('❌ Error reordering categories:', error);
      alert('Error al reordenar. Se revertirán los cambios.');
      
      // Rollback: recargar desde el backend
      loadCategories(true);
    }
  };
  // #end-event

  // #event handleDragCancel
  /**
   * Se ejecuta cuando se cancela el drag.
   */
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
                />
              ))}
            </div>
          </SortableContext>

          {/* 🔧 DragOverlay: Renderiza el elemento que se está arrastrando */}
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

export default ProductsPage;
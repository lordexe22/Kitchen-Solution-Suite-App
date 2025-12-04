/* src/hooks/useCategories.ts */
// #section imports
import { useCallback } from 'react';
import { useCategoriesStore } from '../store/Categories.store';
import { useAsyncOperation } from './useAsyncOperation';
import {
  fetchBranchCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  reorderCategories as reorderCategoriesService,
} from '../services/categories/categories.service';
import type { CategoryFormData, Category } from '../store/Categories.types';
import { useProductsStore } from '../store/Products.store';
// #end-section

// #hook useCategories
/**
 * Hook personalizado para gestionar categorías de una sucursal.
 * Implementa cache: verifica store antes de hacer fetch.
 * 
 * @param {number} branchId - ID de la sucursal
 * @returns {object} Estado y funciones para gestionar categorías
 * 
 * @example
 * const { categories, isLoading, loadCategories, createCategory } = useCategories(1);
 */
export const useCategories = (branchId: number) => {
  const {
    getCategoriesForBranch,
    hasCategoriesForBranch,
    setCategoriesForBranch,
    addCategory,
    updateCategory: updateCategoryInStore,
    updateMultipleCategories: updateMultipleCategoriesInStore,
    removeCategory,
  } = useCategoriesStore();

  // Selector del store de productos para limpiar productos de una categoría cuando se elimina
  const clearProductsForCategory = useProductsStore(state => state.clearProductsForCategory);

  // Hook para operaciones asíncronas
  const { isLoading, error, execute } = useAsyncOperation();

  // Obtener categorías del store
  const categories = getCategoriesForBranch(branchId);

  // #function loadCategories
  /**
   * Carga categorías de la sucursal.
   * Si ya están en el store, no hace fetch.
   */
  const loadCategories = useCallback(async (forceRefresh = false) => {
    // ✅ CACHE: Verificar si ya están en el store
    if (!forceRefresh && hasCategoriesForBranch(branchId)) {
      console.log(`✅ Categories de branchId ${branchId} ya están en cache`);
      return;
    }

    await execute<void>(
      async () => {
        console.log(`🔄 Fetching categories de branchId ${branchId}...`);
        const categories = await fetchBranchCategories(branchId);
        setCategoriesForBranch(branchId, categories);
        console.log(`✅ Categories cargadas y guardadas en store`);
      },
      'Error al cargar categorías'
    );
  }, [execute, branchId, hasCategoriesForBranch, setCategoriesForBranch]);
  // #end-function

  // #function createCategory
  /**
   * Crea una nueva categoría.
   * 
   * @param {Omit<CategoryFormData, 'branchId'>} data - Datos de la categoría (sin branchId)
   */
  const createCategory = useCallback(async (data: Omit<CategoryFormData, 'branchId'>) => {
    const result = await execute<Category>(
      async () => {
        const newCategory = await createCategoryService({
          ...data,
          branchId
        });
        addCategory(newCategory);
        return newCategory;
      },
      'Error al crear categoría'
    );
    if (!result) throw new Error('Error al crear categoría');
    return result;
  }, [execute, branchId, addCategory]);
  // #end-function

  // #function updateCategory
  /**
   * Actualiza una categoría existente.
   * 
   * @param {number} id - ID de la categoría
   * @param {Partial<CategoryFormData>} updates - Datos a actualizar
   */
  const updateCategory = useCallback(async (id: number, updates: Partial<CategoryFormData>) => {
    const result = await execute<Category>(
      async () => {
        const updatedCategory = await updateCategoryService(id, updates);
        updateCategoryInStore(id, updatedCategory);
        return updatedCategory;
      },
      'Error al actualizar categoría'
    );
    if (!result) throw new Error('Error al actualizar categoría');
    return result;
  }, [execute, updateCategoryInStore]);
  // #end-function

  // #function deleteCategory
  /**
   * Elimina una categoría (hard delete).
   * 
   * @param {number} id - ID de la categoría
   */
  const deleteCategory = useCallback(async (id: number) => {
    await execute<void>(
      async () => {
        await deleteCategoryService(id);
        removeCategory(id, branchId);
        // Limpiar productos asociados (si los hay) para que la UI se actualice inmediatamente
        try {
          clearProductsForCategory(id);
        } catch (err) {
          console.warn('Warning clearing products for deleted category:', err);
        }
      },
      'Error al eliminar categoría'
    );
  }, [execute, branchId, removeCategory, clearProductsForCategory]);
  // #end-function

  // #function reorderCategories
  /**
   * Reordena las categorías.
   * Actualiza el sortOrder en el backend y en el store local.
   */
  const reorderCategories = useCallback(async (
    updates: Array<{ id: number; sortOrder: number }>
  ) => {
    await execute<void>(
      async () => {
        // Enviar al backend
        await reorderCategoriesService(updates);
        
        // Actualizar el store local con los nuevos sortOrder usando batch update
        updateMultipleCategoriesInStore(
          updates.map(({ id, sortOrder }) => ({
            id,
            updates: { sortOrder }
          }))
        );
      },
      'Error al reordenar categorías'
    );
  }, [execute, updateMultipleCategoriesInStore]);
  // #end-function

  // #function refreshCategories
  /**
   * Recarga las categorías forzando un fetch.
   */
  const refreshCategories = useCallback(async () => {
    await loadCategories(true);
  }, [loadCategories]);
  // #end-function

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    refreshCategories
  };
};
// #end-hook
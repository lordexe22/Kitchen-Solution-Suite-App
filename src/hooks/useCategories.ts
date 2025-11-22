/* src/hooks/useCategories.ts */
// #section imports
import { useState, useCallback } from 'react';
import { useCategoriesStore } from '../store/Categories.store';
import {
  fetchBranchCategories,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  reorderCategories as reorderCategoriesService,
  duplicateCategory as duplicateCategoryService
} from '../services/categories/categories.service';
import type { CategoryFormData } from '../store/Categories.types';
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setIsLoading(true);
    setError(null);
    try {
      console.log(`🔄 Fetching categories de branchId ${branchId}...`);
      const categories = await fetchBranchCategories(branchId);
      setCategoriesForBranch(branchId, categories);
      console.log(`✅ Categories cargadas y guardadas en store`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías';
      setError(errorMessage);
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [branchId, hasCategoriesForBranch, setCategoriesForBranch]);
  // #end-function

  // #function createCategory
  /**
   * Crea una nueva categoría.
   * 
   * @param {Omit<CategoryFormData, 'branchId'>} data - Datos de la categoría (sin branchId)
   */
  const createCategory = useCallback(async (data: Omit<CategoryFormData, 'branchId'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCategory = await createCategoryService({
        ...data,
        branchId
      });
      addCategory(newCategory);
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría';
      setError(errorMessage);
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [branchId, addCategory]);
  // #end-function

  // #function updateCategory
  /**
   * Actualiza una categoría existente.
   * 
   * @param {number} id - ID de la categoría
   * @param {Partial<CategoryFormData>} updates - Datos a actualizar
   */
  const updateCategory = useCallback(async (id: number, updates: Partial<CategoryFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await updateCategoryService(id, updates);
      updateCategoryInStore(id, updatedCategory);
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría';
      setError(errorMessage);
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateCategoryInStore]);
  // #end-function

  // #function deleteCategory
  /**
   * Elimina una categoría (hard delete).
   * 
   * @param {number} id - ID de la categoría
   */
  const deleteCategory = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCategoryService(id);
      removeCategory(id, branchId);
      // Limpiar productos asociados (si los hay) para que la UI se actualice inmediatamente
      try {
        clearProductsForCategory(id);
      } catch (err) {
        console.warn('Warning clearing products for deleted category:', err);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar categoría';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [branchId, removeCategory, clearProductsForCategory]);
  // #end-function

  // #function reorderCategories
  /**
   * Reordena las categorías.
   * Actualiza el sortOrder en el backend y en el store local.
   */
  const reorderCategories = useCallback(async (
    updates: Array<{ id: number; sortOrder: number }>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Enviar al backend
      await reorderCategoriesService(updates);
      
      // Actualizar el store local con los nuevos sortOrder usando batch update
      updateMultipleCategoriesInStore(
        updates.map(({ id, sortOrder }) => ({
          id,
          updates: { sortOrder }
        }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reordenar categorías';
      setError(errorMessage);
      console.error('Error reordering categories:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateMultipleCategoriesInStore]);
  // #end-function

  // #function refreshCategories
  /**
   * Recarga las categorías forzando un fetch.
   */
  const refreshCategories = useCallback(async () => {
    await loadCategories(true);
  }, [loadCategories]);
  // #end-function

  // #function duplicateCategory
  /**
   * Duplica una categoría completa a otra sucursal.
   * Incluye todos los productos de la categoría.
   * 
   * @param {number} categoryId - ID de la categoría a duplicar
   * @param {number} targetBranchId - ID de la sucursal destino
   */
  const duplicateCategory = useCallback(async (
    categoryId: number,
    targetBranchId: number
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await duplicateCategoryService(categoryId, targetBranchId);
      // No agregamos al store actual porque la categoría está en otra sucursal
      // El usuario deberá navegar a esa sucursal para verla
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al duplicar categoría';
      setError(errorMessage);
      console.error('Error duplicating category:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
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
    refreshCategories,
    duplicateCategory
  };
};
// #end-hook
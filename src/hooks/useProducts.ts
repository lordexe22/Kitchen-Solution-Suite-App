/* src/hooks/useProducts.ts */
// #section Imports
import { useState, useCallback, useMemo } from 'react';
import { useProductsStore } from '../store/Products.store';
import type { ProductFormData } from '../store/Products.types';
import {
  getCategoryProducts as getCategoryProductsService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  reorderProducts as reorderProductsService
} from '../services/products/products.service';
// #end-section

// #hook useProducts
/**
 * Hook personalizado para gestionar productos de una categoría.
 * 
 * Proporciona métodos para:
 * - Cargar productos de una categoría
 * - Crear nuevos productos
 * - Actualizar productos existentes
 * - Eliminar productos
 * - Reordenar productos
 * 
 * @param {number} categoryId - ID de la categoría
 * @returns {object} Estado y métodos para gestionar productos
 * 
 * @example
 * const { products, loadProducts, createProduct } = useProducts(1);
 */
export const useProducts = (categoryId: number) => {
  // #state local
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #end-state

  // #state from store
  const {
    getProductsByCategory,
    setProducts,
    addProduct,
    updateProduct: updateProductInStore,
    updateMultipleProducts: updateMultipleProductsInStore,
    removeProduct
  } = useProductsStore();
  // #end-state

  // #memo products
  /**
   * Productos de la categoría actual desde el store.
   * Se recalcula solo si cambia categoryId.
   */
  const products = useMemo(() => {
    return getProductsByCategory(categoryId);
  }, [categoryId, getProductsByCategory]);
  // #end-memo

  // #function loadProducts
  /**
   * Carga los productos de la categoría desde el backend.
   * 
   * @param {boolean} forceRefresh - Si true, fuerza la recarga aunque ya existan en el store
   */
  const loadProducts = useCallback(async (forceRefresh = false) => {
    // Si ya hay productos y no se fuerza refresh, no hacer nada
    if (products.length > 0 && !forceRefresh) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getCategoryProductsService(categoryId);
      setProducts(categoryId, fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, products.length, setProducts]);
  // #end-function

  // #function createProduct
  /**
   * Crea un nuevo producto.
   * 
   * @param {Omit<ProductFormData, 'categoryId'>} data - Datos del producto (sin categoryId)
   */
  const createProduct = useCallback(async (data: Omit<ProductFormData, 'categoryId'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProduct = await createProductService({
        ...data,
        categoryId
      });
      addProduct(newProduct);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto';
      setError(errorMessage);
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, addProduct]);
  // #end-function

  // #function updateProduct
  /**
   * Actualiza un producto existente.
   * 
   * @param {number} id - ID del producto
   * @param {Partial<ProductFormData>} updates - Datos a actualizar
   */
  const updateProduct = useCallback(async (id: number, updates: Partial<ProductFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProductService(id, updates);
      updateProductInStore(id, updatedProduct);
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(errorMessage);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateProductInStore]);
  // #end-function

  // #function deleteProduct
  /**
   * Elimina un producto (hard delete).
   * 
   * @param {number} id - ID del producto
   */
  const deleteProduct = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProductService(id);
      removeProduct(id, categoryId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(errorMessage);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, removeProduct]);
  // #end-function

  // #function reorderProducts
  /**
   * Reordena los productos.
   * Actualiza el sortOrder en el backend y en el store local.
   */
  const reorderProducts = useCallback(async (
    updates: Array<{ id: number; sortOrder: number }>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Enviar al backend
      await reorderProductsService(updates);
      
      // Actualizar el store local con los nuevos sortOrder usando batch update
      updateMultipleProductsInStore(
        updates.map(({ id, sortOrder }) => ({
          id,
          updates: { sortOrder }
        }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reordenar productos';
      setError(errorMessage);
      console.error('Error reordering products:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateMultipleProductsInStore]);
  // #end-function

  // #function refreshProducts
  /**
   * Recarga los productos forzando un fetch.
   */
  const refreshProducts = useCallback(async () => {
    await loadProducts(true);
  }, [loadProducts]);
  // #end-function

  return {
    products,
    isLoading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    refreshProducts
  };
};
// #end-hook
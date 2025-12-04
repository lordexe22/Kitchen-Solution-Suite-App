/* src/hooks/useProducts.ts */
// #section Imports
import { useCallback } from 'react';
import { useProductsStore } from '../store/Products.store';
import { useAsyncOperation } from './useAsyncOperation';
import type { ProductFormData } from '../store/Products.types';
import {
  getCategoryProducts as getCategoryProductsService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  reorderProducts as reorderProductsService
} from '../services/products/products.service';
import type { ProductWithParsedImages } from '../store/Products.types';
// #end-section

// Referencia vacía única para evitar crear un `[]` nuevo en cada selector
const EMPTY_PRODUCTS: ProductWithParsedImages[] = [];

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
  const { isLoading, error, execute } = useAsyncOperation();
  // #end-state

  // #state from store (suscribirse correctamente usando selectores)
  const setProducts = useProductsStore(state => state.setProducts);
  const addProduct = useProductsStore(state => state.addProduct);
  const updateProductInStore = useProductsStore(state => state.updateProduct);
  const updateMultipleProductsInStore = useProductsStore(state => state.updateMultipleProducts);
  const removeProduct = useProductsStore(state => state.removeProduct);
  // Productos de la categoría actual suscritos desde el store.
  // Evitar devolver un array literal nuevo cuando no hay productos,
  // para que Zustand/React no entre en un bucle de renders.
  const products = useProductsStore(state => state.productsByCategory.get(categoryId) ?? EMPTY_PRODUCTS);
  // #end-state
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

    await execute<void>(
      async () => {
        const fetchedProducts = await getCategoryProductsService(categoryId);
        setProducts(categoryId, fetchedProducts);
      },
      'Error al cargar productos'
    );
  }, [execute, categoryId, products.length, setProducts]);
  // #end-function

  // #function createProduct
  /**
   * Crea un nuevo producto.
   * 
   * @param {Omit<ProductFormData, 'categoryId'>} data - Datos del producto (sin categoryId)
   */
  const createProduct = useCallback(async (data: Omit<ProductFormData, 'categoryId'>) => {
    const result = await execute<ProductWithParsedImages>(
      async () => {
        const newProduct = await createProductService({
          ...data,
          categoryId
        });
        addProduct(newProduct);
        return newProduct;
      },
      'Error al crear producto'
    );
    if (!result) throw new Error('Error al crear producto');
    return result;
  }, [execute, categoryId, addProduct]);
  // #end-function

  // #function updateProduct
  /**
   * Actualiza un producto existente.
   * 
   * @param {number} id - ID del producto
   * @param {Partial<ProductFormData>} updates - Datos a actualizar
   */
  const updateProduct = useCallback(async (id: number, updates: Partial<ProductFormData>) => {
    const result = await execute<ProductWithParsedImages>(
      async () => {
        const updatedProduct = await updateProductService(id, updates);
        updateProductInStore(id, updatedProduct);
        return updatedProduct;
      },
      'Error al actualizar producto'
    );
    if (!result) throw new Error('Error al actualizar producto');
    return result;
  }, [execute, updateProductInStore]);
  // #end-function

  // #function deleteProduct
  /**
   * Elimina un producto (hard delete).
   * 
   * @param {number} id - ID del producto
   */
  const deleteProduct = useCallback(async (id: number) => {
    await execute<void>(
      async () => {
        await deleteProductService(id);
        removeProduct(id, categoryId);
      },
      'Error al eliminar producto'
    );
  }, [execute, categoryId, removeProduct]);
  // #end-function

  // #function reorderProducts
  /**
   * Reordena los productos.
   * Actualiza el sortOrder en el backend y en el store local.
   */
  const reorderProducts = useCallback(async (
    updates: Array<{ id: number; sortOrder: number }>
  ) => {
    await execute<void>(
      async () => {
        // Enviar al backend
        await reorderProductsService(updates);
        
        // Actualizar el store local con los nuevos sortOrder usando batch update
        updateMultipleProductsInStore(
          updates.map(({ id, sortOrder }) => ({
            id,
            updates: { sortOrder }
          }))
        );
      },
      'Error al reordenar productos'
    );
  }, [execute, updateMultipleProductsInStore]);
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
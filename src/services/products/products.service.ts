/* src/services/products/products.service.ts */
// #section Imports
import { httpClient } from '../../api/httpClient.instance';
import type { Product, ProductFormData } from '../../store/Products.types';
// #end-section

// #function getCategoryProducts
/**
 * Obtiene todos los productos de una categoría.
 * 
 * @async
 * @param {number} categoryId - ID de la categoría
 * @returns {Promise<Product[]>} Lista de productos
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const products = await getCategoryProducts(1);
 */
export const getCategoryProducts = async (categoryId: number): Promise<Product[]> => {
  const response = await httpClient.get<{ products: Product[] }>(
    `/products/category/${categoryId}`
  );
  return response.products;
};
// #end-function

// #function getProductById
/**
 * Obtiene un producto por su ID.
 * 
 * @async
 * @param {number} id - ID del producto
 * @returns {Promise<Product>} Producto encontrado
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const product = await getProductById(1);
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await httpClient.get<{ product: Product }>(`/products/${id}`);
  return response.product;
};
// #end-function

// #function createProduct
/**
 * Crea un nuevo producto.
 * 
 * @async
 * @param {ProductFormData} data - Datos del producto
 * @returns {Promise<Product>} Producto creado
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const product = await createProduct({
 *   categoryId: 1,
 *   name: 'Pizza Margherita',
 *   basePrice: 12.99
 * });
 */
export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const response = await httpClient.post<{ product: Product }>('/products', data);
  return response.product;
};
// #end-function

// #function updateProduct
/**
 * Actualiza un producto existente.
 * 
 * @async
 * @param {number} id - ID del producto
 * @param {Partial<ProductFormData>} updates - Datos a actualizar
 * @returns {Promise<Product>} Producto actualizado
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const product = await updateProduct(1, {
 *   name: 'Pizza Napolitana',
 *   basePrice: 13.99
 * });
 */
export const updateProduct = async (
  id: number,
  updates: Partial<ProductFormData>
): Promise<Product> => {
  const response = await httpClient.put<{ product: Product }>(
    `/products/${id}`,
    updates
  );
  return response.product;
};
// #end-function

// #function deleteProduct
/**
 * Elimina un producto (hard delete).
 * 
 * @async
 * @param {number} id - ID del producto
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteProduct(1);
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await httpClient.delete(`/products/${id}`);
};
// #end-function

// #function reorderProducts
/**
 * Actualiza el orden de múltiples productos.
 * 
 * @async
 * @param {Array<{ id: number, sortOrder: number }>} updates - Array de actualizaciones
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await reorderProducts([
 *   { id: 1, sortOrder: 1 },
 *   { id: 2, sortOrder: 2 }
 * ]);
 */
export const reorderProducts = async (
  updates: Array<{ id: number; sortOrder: number }>
): Promise<void> => {
  await httpClient.patch('/products/reorder', { updates });
};
// #end-function
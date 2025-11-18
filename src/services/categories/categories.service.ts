/* src/services/categories/categories.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { Category, CategoryFormData } from '../../store/Categories.types';
// #end-section

// #function fetchBranchCategories
/**
 * Obtiene todas las categorías de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<Category[]>} Lista de categorías
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const categories = await fetchBranchCategories(1);
 */
export const fetchBranchCategories = async (branchId: number): Promise<Category[]> => {
  const response = await httpClient.get<{ categories: Category[] }>(`/categories/branch/${branchId}`);
  return response.categories;
};
// #end-function

// #function createCategory
/**
 * Crea una nueva categoría.
 * 
 * @async
 * @param {CategoryFormData} data - Datos de la categoría a crear
 * @returns {Promise<Category>} Categoría creada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const newCategory = await createCategory({
 *   branchId: 1,
 *   name: 'Pizzas',
 *   backgroundColor: '#FF6B6B'
 * });
 */
export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  const response = await httpClient.post<{ category: Category }>('/categories', data);
  return response.category;
};
// #end-function

// #function updateCategory
/**
 * Actualiza una categoría existente.
 * 
 * @async
 * @param {number} id - ID de la categoría
 * @param {Partial<CategoryFormData>} updates - Datos a actualizar
 * @returns {Promise<Category>} Categoría actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateCategory(1, { name: 'Pizzas Especiales' });
 */
export const updateCategory = async (
  id: number,
  updates: Partial<CategoryFormData>
): Promise<Category> => {
  const response = await httpClient.put<{ category: Category }>(`/categories/${id}`, updates);
  return response.category;
};
// #end-function

// #function deleteCategory
/**
 * Elimina una categoría (hard delete).
 * 
 * @async
 * @param {number} id - ID de la categoría
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteCategory(1);
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await httpClient.delete(`/categories/${id}`);
};
// #end-function

// #function getCategoryById
/**
 * Obtiene una categoría específica por ID.
 * 
 * @async
 * @param {number} id - ID de la categoría
 * @returns {Promise<Category>} Categoría encontrada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const category = await getCategoryById(1);
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await httpClient.get<{ category: Category }>(`/categories/${id}`);
  return response.category;
};
// #end-function
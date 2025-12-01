/* src/services/categories/categories.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { Category, CategoryFormData, CategoryImportResponse } from '../../store/Categories.types';
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

// #function reorderCategories
/**
 * Actualiza el orden de múltiples categorías.
 * 
 * @async
 * @param {Array<{ id: number, sortOrder: number }>} updates - Array de actualizaciones
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await reorderCategories([
 *   { id: 1, sortOrder: 0 },
 *   { id: 2, sortOrder: 1 }
 * ]);
 */
export const reorderCategories = async (
  updates: Array<{ id: number; sortOrder: number }>
): Promise<void> => {
  await httpClient.patch('/categories/reorder', { updates });
};
// #end-function

// #function exportCategory
/**
 * Exporta una categoría con sus productos a un archivo Excel.
 * Descarga automáticamente el archivo en el navegador.
 * 
 * @async
 * @param {number} categoryId - ID de la categoría a exportar
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await exportCategory(1);
 * // Se descarga: categoria-pizzas.xlsx
 */
export const exportCategory = async (categoryId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${httpClient['config'].baseURL}/categories/${categoryId}/export`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al exportar la categoría');
    }

    // Obtener el nombre del archivo desde el header Content-Disposition
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'categoria.xlsx';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Descargar el archivo
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error('Error in exportCategory:', error);
    throw error;
  }
};
// #end-function

// #function importCategory
/**
 * Importa una categoría con sus productos desde un archivo Excel.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal destino
 * @param {File} file - Archivo Excel (.xlsx)
 * @returns {Promise<CategoryImportResponse>} Resultado de la importación
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const file = inputElement.files[0];
 * const result = await importCategory(1, file);
 * 
 * console.log(`Importado: ${result.summary.categoryName}`);
 * console.log(`Productos: ${result.summary.productsImported}`);
 * if (result.summary.wasRenamed) {
 *   console.log(`Renombrado de: ${result.summary.originalName}`);
 * }
 */
export const importCategory = async (
  branchId: number,
  file: File
): Promise<CategoryImportResponse> => {
  try {
    const formData = new FormData();
    formData.append('branchId', branchId.toString());
    formData.append('file', file);

    const response = await fetch(
      `${httpClient['config'].baseURL}/categories/import`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al importar la categoría');
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error('Error in importCategory:', error);
    throw error;
  }
};
// #end-function
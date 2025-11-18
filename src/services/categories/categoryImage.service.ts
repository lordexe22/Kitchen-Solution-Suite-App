// src/services/categories/categoryImage.service.ts

// #interface CategoryImageResponse
interface CategoryImageResponse {
  categoryId: number;
  imageUrl: string;
  cloudinary: {
    publicId: string;
    url: string;
  };
}
// #end-interface

// #function uploadCategoryImage
/**
 * Sube o actualiza la imagen de una categoría.
 * 
 * @param categoryId - ID de la categoría
 * @param file - Archivo de imagen a subir
 * @returns Respuesta con la URL de la imagen subida
 * 
 * @example
 * const file = input.files[0];
 * const result = await uploadCategoryImage(1, file);
 * console.log(result.imageUrl);
 */
export const uploadCategoryImage = async (
  categoryId: number,
  file: File
): Promise<CategoryImageResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`http://localhost:4000/api/categories/${categoryId}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload category image');
  }

  const data = await response.json();
  return data.data;
};
// #end-function

// #function deleteCategoryImage
/**
 * Elimina la imagen de una categoría.
 * 
 * @param categoryId - ID de la categoría
 * 
 * @example
 * await deleteCategoryImage(1);
 */
export const deleteCategoryImage = async (categoryId: number): Promise<void> => {
  const response = await fetch(`http://localhost:4000/api/categories/${categoryId}/image`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete category image');
  }
};
// #end-function
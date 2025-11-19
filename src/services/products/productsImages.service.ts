/* src/services/products/productImages.service.ts */
// #section Imports
import type { Product } from '../../store/Products.types';
// #end-section

// #interface ProductImagesResponse
interface ProductImagesResponse {
  product: Product;
  uploadedImages: string[];
}
// #end-interface

// #function uploadProductImages
/**
 * Sube múltiples imágenes a un producto.
 * Máximo 6 imágenes totales.
 * 
 * @param {number} productId - ID del producto
 * @param {File[]} files - Archivos de imagen a subir
 * @returns {Promise<ProductImagesResponse>} Respuesta con el producto actualizado
 * 
 * @example
 * const files = Array.from(input.files);
 * const result = await uploadProductImages(1, files);
 */
export const uploadProductImages = async (
  productId: number,
  files: File[]
): Promise<ProductImagesResponse> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`http://localhost:4000/api/products/${productId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload product images');
  }

  const data = await response.json();
  return data.data;
};
// #end-function

// #function deleteProductImage
/**
 * Elimina una imagen específica de un producto.
 * 
 * @param {number} productId - ID del producto
 * @param {string} imageUrl - URL de la imagen a eliminar
 * @returns {Promise<Product>} Producto actualizado
 * 
 * @example
 * await deleteProductImage(1, 'https://res.cloudinary.com/...');
 */
export const deleteProductImage = async (
  productId: number,
  imageUrl: string
): Promise<Product> => {
  const response = await fetch(`http://localhost:4000/api/products/${productId}/images`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete product image');
  }

  const data = await response.json();
  return data.data.product;
};
// #end-function

// #function reorderProductImages
/**
 * Reordena las imágenes de un producto.
 * La primera imagen será la imagen principal.
 * 
 * @param {number} productId - ID del producto
 * @param {string[]} images - Array de URLs en el nuevo orden
 * @returns {Promise<Product>} Producto actualizado
 * 
 * @example
 * await reorderProductImages(1, [
 *   'https://res.cloudinary.com/.../image-2.jpg',
 *   'https://res.cloudinary.com/.../image-1.jpg'
 * ]);
 */
export const reorderProductImages = async (
  productId: number,
  images: string[]
): Promise<Product> => {
  const response = await fetch(`http://localhost:4000/api/products/${productId}/images/reorder`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to reorder product images');
  }

  const data = await response.json();
  return data.data.product;
};
// #end-function
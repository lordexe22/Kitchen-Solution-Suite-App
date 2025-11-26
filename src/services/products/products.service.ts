/* src/services/products/products.service.ts */
import { httpClient } from '../../api/httpClient.instance';
import type { Product, ProductFormData } from '../../store/Products.types';

interface ProductPayload {
  categoryId: number;
  name: string;
  description?: string;
  basePrice: number;
  discount?: number;
  hasStockControl?: boolean;
  currentStock?: number;
  stockAlertThreshold?: number;
  stockStopThreshold?: number;
  isAvailable?: boolean;
  images?: string[];
  tags: string | null;
}

export const getCategoryProducts = async (categoryId: number): Promise<Product[]> => {
  const response = await httpClient.get<{ products: Product[] }>(
    `/products/category/${categoryId}`
  );
  return response.products;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await httpClient.get<{ product: Product }>(`/products/${id}`);
  return response.product;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const payload: ProductPayload = {
    ...data,
    tags: data.tags && data.tags.length > 0 ? JSON.stringify(data.tags) : null
  };
  
  const response = await httpClient.post<{ product: Product }>('/products', payload);
  return response.product;
};

export const updateProduct = async (
  id: number,
  updates: Partial<ProductFormData>
): Promise<Product> => {
  const { tags, ...restUpdates } = updates;
  
  const payload: Partial<ProductPayload> = {
    ...restUpdates,
    tags: tags !== undefined 
      ? (tags && tags.length > 0 ? JSON.stringify(tags) : null)
      : undefined
  };
  
  const response = await httpClient.put<{ product: Product }>(
    `/products/${id}`,
    payload
  );
  return response.product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await httpClient.delete(`/products/${id}`);
};

export const reorderProducts = async (
  updates: Array<{ id: number; sortOrder: number }>
): Promise<void> => {
  await httpClient.put('/products/reorder', { updates });
};
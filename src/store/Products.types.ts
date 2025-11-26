/* src/store/Products.types.ts */
import type { TagConfiguration } from '../modules/tagCreator';

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  images: string | null;
  tags: string | null;
  basePrice: string;
  discount: string | null;
  hasStockControl: boolean;
  currentStock: number | null;
  stockAlertThreshold: number | null;
  stockStopThreshold: number | null;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithParsedImages extends Omit<Product, 'images' | 'tags'> {
  images: string[];
  mainImage: string | null;
  tags: TagConfiguration[] | null;
}

export interface ProductWithCalculatedPrice extends ProductWithParsedImages {
  finalPrice: number;
  hasDiscount: boolean;
  discountAmount: number;
}

export type ProductFormData = {
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
  tags?: TagConfiguration[];
};

export function parseProductImages(product: Product): ProductWithParsedImages {
  const { images, tags, ...rest } = product;
  
  let parsedImages: string[] = [];
  if (images) {
    try {
      parsedImages = JSON.parse(images);
    } catch (error) {
      console.error('Error parsing product images:', error);
    }
  }
  
  let parsedTags: TagConfiguration[] | null = null;
  if (tags) {
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      console.error('Error parsing product tags:', error);
    }
  }
  
  return {
    ...rest,
    images: parsedImages,
    mainImage: parsedImages.length > 0 ? parsedImages[0] : null,
    tags: parsedTags
  };
}

export function calculateProductPrice(product: ProductWithParsedImages): ProductWithCalculatedPrice {
  const basePrice = parseFloat(product.basePrice);
  const discount = product.discount ? parseFloat(product.discount) : 0;
  
  const hasDiscount = discount > 0;
  const discountAmount = hasDiscount ? (basePrice * discount) / 100 : 0;
  const finalPrice = basePrice - discountAmount;
  
  return {
    ...product,
    finalPrice,
    hasDiscount,
    discountAmount
  };
}

export function processProduct(product: Product): ProductWithCalculatedPrice {
  const withImages = parseProductImages(product);
  return calculateProductPrice(withImages);
}

export function isStockLow(product: Product): boolean {
  if (!product.hasStockControl) return false;
  if (product.currentStock === null || product.stockAlertThreshold === null) return false;
  return product.currentStock <= product.stockAlertThreshold;
}

export function isStockCritical(product: Product): boolean {
  if (!product.hasStockControl) return false;
  if (product.currentStock === null || product.stockStopThreshold === null) return false;
  return product.currentStock <= product.stockStopThreshold;
}

export type StockStatus = 'ok' | 'low' | 'critical' | 'no-control';

export function getStockStatus(product: Product): StockStatus {
  if (!product.hasStockControl) return 'no-control';
  if (isStockCritical(product)) return 'critical';
  if (isStockLow(product)) return 'low';
  return 'ok';
}
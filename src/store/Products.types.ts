/* src/store/Products.types.ts */

// #interface Product
/**
 * Representa un producto en el frontend.
 * Replica la estructura de la tabla products del backend.
 */
export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  images: string | null; // JSON array de URLs
  basePrice: string; // Decimal viene como string desde la BD
  discount: string | null; // Decimal viene como string desde la BD
  hasStockControl: boolean;
  currentStock: number | null;
  stockAlertThreshold: number | null;
  stockStopThreshold: number | null;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string; // En frontend las fechas vienen como string del JSON
  updatedAt: string;
}
// #end-interface

// #interface ProductWithParsedImages
/**
 * Producto con imágenes parseadas.
 * Es la que se usa en la UI.
 */
export interface ProductWithParsedImages extends Omit<Product, 'images'> {
  images: string[]; // Array parseado
  mainImage: string | null; // Primera imagen (principal)
}
// #end-interface

// #interface ProductWithCalculatedPrice
/**
 * Producto con precio final calculado.
 * Extiende ProductWithParsedImages.
 */
export interface ProductWithCalculatedPrice extends ProductWithParsedImages {
  finalPrice: number; // Calculado: basePrice - (basePrice * discount / 100)
  hasDiscount: boolean; // true si discount > 0
  discountAmount: number; // Cantidad descontada en valor absoluto
}
// #end-interface

// #type ProductFormData
/**
 * Datos del formulario para crear/actualizar un producto.
 */
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
};
// #end-type

// #function parseProductImages
/**
 * Parsea el campo images de string JSON a array.
 * También calcula mainImage (primera imagen).
 * 
 * @param product - Producto con images como string
 * @returns Producto con images parseado
 */
export function parseProductImages(product: Product): ProductWithParsedImages {
  const { images, ...rest } = product;
  
  let parsedImages: string[] = [];
  if (images) {
    try {
      parsedImages = JSON.parse(images);
    } catch (error) {
      console.error('Error parsing product images:', error);
    }
  }
  
  return {
    ...rest,
    images: parsedImages,
    mainImage: parsedImages.length > 0 ? parsedImages[0] : null
  };
}
// #end-function

// #function calculateProductPrice
/**
 * Calcula el precio final del producto aplicando el descuento.
 * 
 * @param product - Producto con precios
 * @returns Producto con precio final calculado
 */
export function calculateProductPrice(
  product: ProductWithParsedImages
): ProductWithCalculatedPrice {
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
// #end-function

// #function processProduct
/**
 * Procesa un producto completo: parsea imágenes y calcula precio.
 * 
 * @param product - Producto raw desde la BD
 * @returns Producto procesado para UI
 */
export function processProduct(product: Product): ProductWithCalculatedPrice {
  const withImages = parseProductImages(product);
  return calculateProductPrice(withImages);
}
// #end-function

// #function isStockLow
/**
 * Determina si el stock está bajo (por debajo del umbral de alerta).
 * 
 * @param product - Producto a verificar
 * @returns true si el stock está bajo
 */
export function isStockLow(product: Product): boolean {
  if (!product.hasStockControl) return false;
  if (product.currentStock === null || product.stockAlertThreshold === null) return false;
  return product.currentStock <= product.stockAlertThreshold;
}
// #end-function

// #function isStockCritical
/**
 * Determina si el stock está crítico (por debajo del umbral de parada).
 * 
 * @param product - Producto a verificar
 * @returns true si el stock está crítico
 */
export function isStockCritical(product: Product): boolean {
  if (!product.hasStockControl) return false;
  if (product.currentStock === null || product.stockStopThreshold === null) return false;
  return product.currentStock <= product.stockStopThreshold;
}
// #end-function

// #type StockStatus
/**
 * Estado del stock de un producto.
 */
export type StockStatus = 'ok' | 'low' | 'critical' | 'no-control';
// #end-type

// #function getStockStatus
/**
 * Obtiene el estado del stock de un producto.
 * 
 * @param product - Producto a verificar
 * @returns Estado del stock
 */
export function getStockStatus(product: Product): StockStatus {
  if (!product.hasStockControl) return 'no-control';
  if (isStockCritical(product)) return 'critical';
  if (isStockLow(product)) return 'low';
  return 'ok';
}
// #end-function
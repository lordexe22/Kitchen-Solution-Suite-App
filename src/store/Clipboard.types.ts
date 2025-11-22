/* src/store/Clipboard.types.ts */

// #type ClipboardItemType
/**
 * Tipos de elementos que se pueden copiar.
 */
export type ClipboardItemType = 'category' | 'product';
// #end-type

// #interface ClipboardCategory
/**
 * Datos de una categoría copiada.
 */
export interface ClipboardCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  textColor: string;
  backgroundMode: 'solid' | 'gradient';
  backgroundColor: string;
  gradientConfig: string | null;
  branchId: number;
}
// #end-interface

// #interface ClipboardProduct
/**
 * Datos de un producto copiado.
 */
export interface ClipboardProduct {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  images: string | null;
  basePrice: string;
  discount: string | null;
  hasStockControl: boolean;
  currentStock: number | null;
  stockAlertThreshold: number | null;
  stockStopThreshold: number | null;
  isAvailable: boolean;
}
// #end-interface

// #type ClipboardItem
/**
 * Item del clipboard con tipo discriminado.
 */
export type ClipboardItem =
  | { type: 'category'; data: ClipboardCategory }
  | { type: 'product'; data: ClipboardProduct }
  | null;
// #end-type
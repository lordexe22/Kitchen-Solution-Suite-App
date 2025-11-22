/* src/store/Clipboard.store.ts */
// #section Imports
import { create } from 'zustand';
import type { ClipboardItem, ClipboardCategory, ClipboardProduct } from './Clipboard.types';
// #end-section

// #interface ClipboardState
/**
 * Estado del store de clipboard.
 */
interface ClipboardState {
  // Estado
  copiedItem: ClipboardItem;
  
  // Getters
  hasCopiedCategory: () => boolean;
  hasCopiedProduct: () => boolean;
  getCopiedCategory: () => ClipboardCategory | null;
  getCopiedProduct: () => ClipboardProduct | null;
  
  // Setters
  copyCategory: (category: ClipboardCategory) => void;
  copyProduct: (product: ClipboardProduct) => void;
  clear: () => void;
}
// #end-interface

// #store useClipboardStore
/**
 * Store de Zustand para gestionar el clipboard (copiar/pegar).
 * 
 * Permite copiar categorías o productos y pegarlos en otras ubicaciones.
 * Solo puede haber un item copiado a la vez por tipo.
 */
export const useClipboardStore = create<ClipboardState>((set, get) => ({
  // Estado inicial
  copiedItem: null,

  // Getter: Verificar si hay categoría copiada
  hasCopiedCategory: () => {
    const item = get().copiedItem;
    return item !== null && item.type === 'category';
  },

  // Getter: Verificar si hay producto copiado
  hasCopiedProduct: () => {
    const item = get().copiedItem;
    return item !== null && item.type === 'product';
  },

  // Getter: Obtener categoría copiada
  getCopiedCategory: () => {
    const item = get().copiedItem;
    if (item && item.type === 'category') {
      return item.data;
    }
    return null;
  },

  // Getter: Obtener producto copiado
  getCopiedProduct: () => {
    const item = get().copiedItem;
    if (item && item.type === 'product') {
      return item.data;
    }
    return null;
  },

  // Setter: Copiar categoría
  copyCategory: (category: ClipboardCategory) => {
    set({
      copiedItem: {
        type: 'category',
        data: category
      }
    });
  },

  // Setter: Copiar producto
  copyProduct: (product: ClipboardProduct) => {
    set({
      copiedItem: {
        type: 'product',
        data: product
      }
    });
  },

  // Setter: Limpiar clipboard
  clear: () => {
    set({ copiedItem: null });
  }
}));
// #end-store
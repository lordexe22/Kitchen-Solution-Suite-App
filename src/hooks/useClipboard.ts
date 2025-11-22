/* src/hooks/useClipboard.ts */
// #section Imports
import { useClipboardStore } from '../store/Clipboard.store';
// #end-section

// #hook useClipboard
/**
 * Hook para gestionar el clipboard (copiar/pegar categorías y productos).
 * 
 * @returns {object} Estado y funciones del clipboard
 * 
 * @example
 * const clipboard = useClipboard();
 * clipboard.copyCategory(category);
 * if (clipboard.hasCopiedCategory()) {
 *   // Mostrar botón pegar
 * }
 */
export const useClipboard = () => {
  const {
    copiedItem,
    hasCopiedCategory,
    hasCopiedProduct,
    getCopiedCategory,
    getCopiedProduct,
    copyCategory,
    copyProduct,
    clear
  } = useClipboardStore();

  return {
    copiedItem,
    hasCopiedCategory: hasCopiedCategory(),
    hasCopiedProduct: hasCopiedProduct(),
    getCopiedCategory: getCopiedCategory(),
    getCopiedProduct: getCopiedProduct(),
    copyCategory,
    copyProduct,
    clear
  };
};
// #end-hook
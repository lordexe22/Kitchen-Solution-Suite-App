/* src/hooks/useToast.ts */
// #section Imports
import { useToastStore } from '../store/Toast.store';
// #end-section

// #hook useToast
/**
 * Hook para mostrar toasts desde cualquier componente.
 * 
 * @returns {object} Funciones para mostrar toasts
 * 
 * @example
 * const toast = useToast();
 * toast.success('¡Operación exitosa!');
 * toast.error('Error al guardar');
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) => addToast('success', message, duration),
    error: (message: string, duration?: number) => addToast('error', message, duration),
    info: (message: string, duration?: number) => addToast('info', message, duration),
    warning: (message: string, duration?: number) => addToast('warning', message, duration),
  };
};
// #end-hook
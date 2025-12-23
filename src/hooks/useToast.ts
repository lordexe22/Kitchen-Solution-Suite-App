/* src/hooks/useToast.ts */
import { useToastStore } from '../store/Toast.store';

// #hook useToast
/**
 * Hook simplificado para usar toasts en componentes
 * 
 * Uso:
 * ```tsx
 * const toast = useToast();
 * 
 * toast.success('¡Guardado exitosamente!');
 * toast.error('Error al guardar');
 * toast.warning('Ten cuidado');
 * toast.info('Información relevante');
 * ```
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) => {
      addToast({ type: 'success', message, duration });
    },
    error: (message: string, duration?: number) => {
      addToast({ type: 'error', message, duration });
    },
    warning: (message: string, duration?: number) => {
      addToast({ type: 'warning', message, duration });
    },
    info: (message: string, duration?: number) => {
      addToast({ type: 'info', message, duration });
    },
  };
};
// #end-hook

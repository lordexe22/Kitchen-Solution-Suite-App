/* src/store/Toast/Toast.store.ts */
import { create } from 'zustand';
import type { ToastStore, Toast } from './Toast.types';

// #function generateId - genera un ID único para cada toast
/**
 * Genera un ID único para cada toast.
 */
const generateId = (): string => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// #end-function

// #store useToastStore - store global para gestionar toasts/notificaciones temporales
/**
 * @description Store global para gestionar toasts/notificaciones temporales.
 * @purpose Centralizar la emisión y eliminación de notificaciones transitorias del sistema.
 * @context Consumido por el hook useToast y directamente por componentes que necesiten emitir notificaciones.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 * @example
 * const { success, error } = useToastStore();
 * success('¡Operación exitosa!');
 * error('Algo salió mal');
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },

  success: (message, duration) => {
    set((state) => {
      state.addToast({ type: 'success', message, duration });
      return state;
    });
  },

  error: (message, duration) => {
    set((state) => {
      state.addToast({ type: 'error', message, duration });
      return state;
    });
  },

  warning: (message, duration) => {
    set((state) => {
      state.addToast({ type: 'warning', message, duration });
      return state;
    });
  },

  info: (message, duration) => {
    set((state) => {
      state.addToast({ type: 'info', message, duration });
      return state;
    });
  },
}));
// #end-store

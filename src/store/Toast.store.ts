/* src/store/Toast.store.ts */
import { create } from 'zustand';
import type { ToastStore, Toast } from './Toast.types';

// #function generateId
/**
 * Genera un ID único para cada toast
 */
const generateId = (): string => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// #end-function

// #store useToastStore
/**
 * Store global para gestionar toasts/notificaciones temporales
 * 
 * Uso:
 * ```tsx
 * const { success, error } = useToastStore();
 * success('¡Operación exitosa!');
 * error('Algo salió mal');
 * ```
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration ?? 5000, // 5s por defecto
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-eliminar si tiene duración
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

  // Helpers para tipos específicos
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

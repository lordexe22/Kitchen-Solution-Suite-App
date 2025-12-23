/* src/store/Toast.types.ts */

// #type ToastType
/**
 * Tipos de toast disponibles
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';
// #end-type

// #interface Toast
/**
 * Estructura de un toast individual
 */
export interface Toast {
  /** ID único del toast */
  id: string;
  /** Tipo de toast (éxito, error, advertencia, info) */
  type: ToastType;
  /** Mensaje a mostrar */
  message: string;
  /** Duración en ms antes de auto-cerrar (0 = no auto-cerrar) */
  duration?: number;
}
// #end-interface

// #interface ToastStore
/**
 * Store de Zustand para gestionar toasts globales
 */
export interface ToastStore {
  /** Lista de toasts activos */
  toasts: Toast[];
  
  /** Agregar un nuevo toast */
  addToast: (toast: Omit<Toast, 'id'>) => void;
  
  /** Eliminar un toast por ID */
  removeToast: (id: string) => void;
  
  /** Limpiar todos los toasts */
  clearAll: () => void;
  
  /** Helpers para tipos específicos */
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}
// #end-interface

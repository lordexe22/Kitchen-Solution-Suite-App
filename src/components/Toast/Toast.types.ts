/* src/components/Toast/Toast.types.ts */

// #type ToastType
/**
 * Tipos de toast disponibles.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';
// #end-type

// #interface Toast
/**
 * Configuración de un toast.
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Duración en ms (default: 3000)
}
// #end-interface
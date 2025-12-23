/* src/components/ToastContainer/ToastContainer.types.ts */
import type { Toast } from '../../store/Toast.types';

// #interface ToastItemProps
/**
 * Props para un toast individual
 */
export interface ToastItemProps {
  /** Datos del toast */
  toast: Toast;
  /** Callback al cerrar */
  onClose: (id: string) => void;
}
// #end-interface

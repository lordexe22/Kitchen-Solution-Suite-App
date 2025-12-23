/* src/components/ToastContainer/ToastContainer.tsx */
import { useToastStore } from '../../store/Toast.store';
import type { ToastItemProps } from './ToastContainer.types';
import styles from './ToastContainer.module.css';

// #component ToastItem
/**
 * Componente individual de toast
 */
const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  // #function getIcon
  /**
   * Obtiene el icono según el tipo de toast
   */
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  };
  // #end-function

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span className={styles.icon}>{getIcon()}</span>
      <p className={styles.message}>{toast.message}</p>
      <button
        className={styles.closeButton}
        onClick={() => onClose(toast.id)}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};
// #end-component

// #component ToastContainer
/**
 * Contenedor global de toasts
 * Debe agregarse una vez en el componente raíz de la aplicación
 */
const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
// #end-component

export default ToastContainer;

/* src/components/Toast/Toast.tsx */
// #section imports
import { useEffect, useState } from 'react';
import type { Toast as ToastType } from './Toast.types';
import styles from './Toast.module.css';
// #end-section

// #interface ToastProps
interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}
// #end-interface

// #component Toast
/**
 * Componente Toast individual.
 * Se auto-elimina después de la duración especificada.
 */
function Toast({ toast, onRemove }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 3000;
    
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300); // Esperar animación
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]} ${isExiting ? styles.exiting : ''}`}>
      <span className={styles.toastIcon}>{getIcon()}</span>
      <span className={styles.toastMessage}>{toast.message}</span>
    </div>
  );
}
// #end-component

export default Toast;
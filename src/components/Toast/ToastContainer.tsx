/* src/components/Toast/ToastContainer.tsx */
// #section imports
import Toast from './Toast';
import { useToastStore } from '../../store/Toast.store';
import styles from './Toast.module.css';
// #end-section

// #component ToastContainer
/**
 * Contenedor de toasts.
 * Debe estar montado en el nivel superior de la aplicación.
 */
export default function ToastContainer() {
  // #state from store
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  // #end-state

  // #section return
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
  // #end-section
}
// #end-component
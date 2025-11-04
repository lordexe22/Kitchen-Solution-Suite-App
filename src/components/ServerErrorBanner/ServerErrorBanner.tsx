/* src\components\ServerErrorBanner\ServerErrorBanner.tsx */
// #section imports
import { useEffect } from 'react';
import styles from './ServerErrorBanner.module.css';
import type { ServerErrorBannerProps } from './ServerErrorBanner.types';
// #end-section
// #component ServerErrorBanner
/**
 * Muestra un banner de error temporal o persistente según la configuración.
 *
 * @component
 * @param {ServerErrorBannerProps} props - Propiedades del componente.
 * @param {string | null} props.message - Mensaje de error a mostrar. Si es `null`, el banner no se renderiza.
 * @param {() => void} props.onClose - Función de callback que se ejecuta al cerrar el banner.
 * @param {number} [props.autoCloseDelay=5000] - Tiempo en milisegundos antes del cierre automático.
 * @returns {JSX.Element | null} El banner de error renderizado o `null` si no hay mensaje.
 */
const ServerErrorBanner = ({ 
  message, 
  onClose, 
  autoCloseDelay = 5000 
}: ServerErrorBannerProps) => {
  // #function closeBannerAfterDelay
  /**
   * Inicia un temporizador para cerrar el banner automáticamente después del tiempo definido.
   * Se limpia el temporizador si el componente se desmonta o cambian las dependencias.
   *
   * @function closeBannerAfterDelay
   * @returns {() => void | undefined} Función de limpieza que cancela el temporizador.
   */
  const closeBannerAfterDelay = () => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  };
  // #end-function
  // #event > close banner after delay
  useEffect(closeBannerAfterDelay, [message, onClose, autoCloseDelay]);
  // #end-event
  // #section render
  if (!message) return null;

  return (
    <div className={styles['error-banner']}>
      <div className={styles['error-icon']}>⚠️</div>
      <div className={styles['error-message']}>{message}</div>
      <button 
        className={styles['error-close']} 
        onClick={onClose}
        aria-label="Close error banner"
      >
        ×
      </button>
    </div>
  );
  // #end-section
};
export default ServerErrorBanner;
// #end-component

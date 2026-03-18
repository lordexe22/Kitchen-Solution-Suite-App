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
  // #function closeBannerAfterDelay - Inicia temporizador para cerrar el banner automáticamente
  /**
   * @description Inicia un temporizador para cerrar el banner automáticamente tras el tiempo configurado.
   * @purpose Automatizar el cierre del banner de error sin intervención del usuario.
   * @context Utilizado internamente por ServerErrorBanner como efecto reactivo al mensaje de error.
   * @returns función de limpieza que cancela el temporizador, o undefined si no hay mensaje
   * @since 1.0.0
   * @author Walter Ezequiel Puig
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

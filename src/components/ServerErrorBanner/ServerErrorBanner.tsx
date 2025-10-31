// src/components/ServerErrorBanner/ServerErrorBanner.tsx
import { useEffect } from 'react';
import styles from './ServerErrorBanner.module.css';

interface ServerErrorBannerProps {
  message: string | null;
  onClose: () => void;
  autoCloseDelay?: number; // en milisegundos
}

const ServerErrorBanner = ({ 
  message, 
  onClose, 
  autoCloseDelay = 5000 
}: ServerErrorBannerProps) => {
  
  // Auto-cierre después del delay
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [message, onClose, autoCloseDelay]);

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
};

export default ServerErrorBanner;
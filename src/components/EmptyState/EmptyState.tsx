/* src/components/EmptyState/EmptyState.tsx */
// #section imports
import styles from './EmptyState.module.css';
// #end-section

// #interface EmptyStateProps
interface EmptyStateProps {
  /** Título principal del mensaje */
  title: string;
  /** Descripción o mensaje secundario */
  description: string;
  /** Texto del botón de acción */
  actionButtonText?: string;
  /** Callback cuando se hace clic en el botón */
  onActionClick?: () => void;
  /** Emoji o ícono a mostrar (opcional) */
  icon?: string;
}
// #end-interface

// #component EmptyState
/**
 * Componente para mostrar cuando no hay datos disponibles.
 * 
 * @example
 * <EmptyState
 *   title="No hay compañías"
 *   description="Crea tu primera compañía para comenzar"
 *   actionButtonText="Crear compañía"
 *   onActionClick={() => openModal()}
 *   icon="🏢"
 * />
 */
const EmptyState = ({
  title,
  description,
  actionButtonText,
  onActionClick,
  icon = '📭'
}: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {actionButtonText && onActionClick && (
        <button 
          className={`btn-pri btn-md ${styles.actionButton}`}
          onClick={onActionClick}
        >
          {actionButtonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
// #end-component

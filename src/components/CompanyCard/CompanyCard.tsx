/* src/components/CompanyCard/CompanyCard.tsx */
// #section imports
import { useState } from 'react';
import type { Company } from '../../store/Companies.types';
import styles from './CompanyCard.module.css';
// #end-section

// #interface CompanyCardProps
interface CompanyCardProps {
  /** Datos de la compañía */
  company: Company;
  /** Callback para editar */
  onEdit: (company: Company) => void;
  /** Callback para eliminar */
  onDelete: (id: number) => void;
}
// #end-interface

// #component CompanyCard
/**
 * Tarjeta para mostrar información de una compañía.
 */
const CompanyCard = ({ company, onEdit, onDelete }: CompanyCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(company.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={styles.card}>
      {/* Logo o inicial */}
      <div className={styles.logoContainer}>
        {company.logoUrl ? (
          <img src={company.logoUrl} alt={company.name} className={styles.logo} />
        ) : (
          <div className={styles.logoPlaceholder}>
            {company.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        <h3 className={styles.name}>{company.name}</h3>
        {company.description && (
          <p className={styles.description}>{company.description}</p>
        )}
      </div>

      {/* Acciones */}
      {!showDeleteConfirm ? (
        <div className={styles.actions}>
          <button
            className="btn-sec btn-sm"
            onClick={() => onEdit(company)}
            title="Editar compañía"
          >
            ✏️ Editar
          </button>
          <button
            className="btn-sec btn-sm"
            onClick={handleDeleteClick}
            title="Eliminar compañía"
          >
            🗑️ Eliminar
          </button>
        </div>
      ) : (
        <div className={styles.confirmDelete}>
          <p className={styles.confirmText}>¿Eliminar esta compañía?</p>
          <div className={styles.confirmActions}>
            <button
              className="btn-sec btn-sm"
              onClick={handleCancelDelete}
            >
              Cancelar
            </button>
            <button
              className="btn-pri btn-sm"
              onClick={handleConfirmDelete}
              style={{ backgroundColor: '#dc2626' }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
// #end-component
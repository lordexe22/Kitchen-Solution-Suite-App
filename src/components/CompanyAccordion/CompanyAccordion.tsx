/* src/components/CompanyAccordion/CompanyAccordion.tsx */
// #section imports
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Company } from '../../store/Companies.types';
import styles from './CompanyAccordion.module.css';
// #end-section

// #interface CompanyAccordionProps
interface CompanyAccordionProps {
  company: Company;
  children?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}
// #end-interface

// #component CompanyAccordion
/**
 * Componente acordeón reutilizable para mostrar información de una compañía.
 * 
 * Características:
 * - Header con logo, nombre y descripción de la compañía
 * - Botones opcionales de editar/eliminar (solo se muestran si se pasan los callbacks)
 * - Contenido expandible mediante children (cualquier componente)
 * - Estado de expansión interno con indicador visual
 * - Animaciones suaves de apertura/cierre
 */
const CompanyAccordion = ({ company, children, onEdit, onDelete, onToggle }: CompanyAccordionProps) => {
  // #const allowEdit, allowDelete, hasChildren
  const allowEdit = typeof onEdit === 'function';
  const allowDelete = typeof onDelete === 'function';
  const hasChildren = !!children;
  // #end-const

  // #state [isExpanded, setIsExpanded]
  const [isExpanded, setIsExpanded] = useState(false);
  // #end-state

  // #event handleToggle
  /**
   * Maneja el evento de expandir/colapsar el acordeón.
   * Cambia el estado interno y notifica al padre si existe callback.
   */
  const handleToggle = () => {
    setIsExpanded(prev => {
      const newState = !prev;
      // Notificar al padre después de cambiar estado
      if (onToggle) onToggle();
      return newState;
    });
  };
  // #end-event

  // #event handleEdit
  /**
   * Maneja el evento de edición.
   * Detiene la propagación para evitar expandir/colapsar.
   */
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allowEdit) onEdit();
  };
  // #end-event

  // #event handleDelete
  /**
   * Maneja el evento de eliminación.
   * Detiene la propagación para evitar expandir/colapsar.
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allowDelete) onDelete();
  };
  // #end-event

  // #function getCompanyInitials
  /**
   * Obtiene las iniciales del nombre de la compañía para mostrar
   * como placeholder cuando no hay logo.
   */
  const getCompanyInitials = (): string => {
    const words = company.name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  // #end-function

  // #section return
  return (
    <div className={styles.accordion}>
      {/* #section Header */}
      <div className={styles.header} onClick={handleToggle}>
        {/* #section Header Left - show company data */}
        <div className={styles.headerLeft}>
          <span className={`${styles.expandIcon} ${isExpanded ? styles.isExpanded : ''}`}>
            ▶
          </span>

          {/* #section Logo */}
          <div className={styles.logo}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={`Logo de ${company.name}`} />
            ) : (
              <div className={styles.logoPlaceholder}>
                {getCompanyInitials()}
              </div>
            )}
          </div>
          {/* #end-section */}

          {/* #section Company Info */}
          <div className={styles.info}>
            <h3 className={styles.companyName}>
              {company.name}
            </h3>
            {company.description && (
              <p className={styles.companyDescription}>
                {company.description}
              </p>
            )}
          </div>
          {/* #end-section */}
        </div>
        {/* #end-section */}

        {/* #section Header Right - show action buttons */}
        <div className={styles.headerRight}>
          {allowEdit && (
            <button 
              className="btn-sec btn-sm" 
              onClick={handleEdit}
            >
              ✏️ Editar
            </button>
          )}
          {allowDelete && (
            <button 
              className="btn-danger btn-sm" 
              onClick={handleDelete}
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
        {/* #end-section */}
      </div>
      {/* #end-section */}

      {/* #section Expanded content */}
      {isExpanded && hasChildren && (
        <div className={styles.children}>
          {children}
        </div>
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default CompanyAccordion;
// #end-component
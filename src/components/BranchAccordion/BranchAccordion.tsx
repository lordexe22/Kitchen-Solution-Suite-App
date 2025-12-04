/* src/components/BranchAccordion/BranchAccordion.tsx */
// #section imports
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { BranchWithLocation } from '../../store/Branches.types';
import { useBranchAccordion } from '../../hooks/BranchAccordion';
import styles from './BranchAccordion.module.css';
// #end-section

// #interface BranchAccordionProps
interface BranchAccordionProps {
  branch: BranchWithLocation;
  displayIndex: number;
  children?: ReactNode;
  expandable?: boolean;
  onEdit?: () => void;
  onEditLocation?: () => void;
  onEditName?: () => void;
  onEditSocials?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}
// #end-interface

// #component BranchAccordion
/**
 * Componente acordeón reutilizable para mostrar información de una sucursal.
 * 
 * Características:
 * - Header con nombre/dirección de la sucursal
 * - Botones opcionales de editar/eliminar (solo se muestran si se pasan los callbacks)
 * - Contenido expandible opcional mediante children
 * - Estado de expansión interno con indicador visual
 * - Configurable si es expandible o no
 */
const BranchAccordion = ({
  branch,
  displayIndex,
  children,
  expandable = false,
  onEdit,
  onDelete,
  onToggle
}: BranchAccordionProps) => {
  // #const allowEdit, allowDelete, hasChildren, isExpandable
  const allowEdit = typeof onEdit === 'function';
  const allowDelete = typeof onDelete === 'function';
  const hasChildren = !!children;
  const isExpandable = expandable && hasChildren;
  // #end-const

  // #state [isExpanded, setIsExpanded]
  const [isExpanded, setIsExpanded] = useState(false);
  // #end-state

  // Get accordion context if available (only works within BranchManagementPage)
  let accordionContext: ReturnType<typeof useBranchAccordion> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    accordionContext = useBranchAccordion();
  } catch {
    // Context not available (component used outside of BranchManagementPage)
  }

  // Sync expanded state with context if available
  useEffect(() => {
    if (accordionContext && branch.id) {
      setIsExpanded(accordionContext.isBranchOpen(branch.id));
    }
  }, [accordionContext, branch.id]);

  // #event handleToggle
  /**
   * Maneja el evento de expandir/colapsar el acordeón.
   * Solo funciona si el acordeón es expandible.
   * Si hay context disponible, también actualiza el contexto.
   */
  const handleToggle = () => {
    if (!isExpandable) return;
    
    setIsExpanded(prev => {
      const newState = !prev;
      // Update context if available
      if (accordionContext && branch.id) {
        if (newState) {
          accordionContext.openBranch(branch.id);
        } else {
          accordionContext.closeBranch(branch.id);
        }
      }
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

  // #function getDisplayName
  /**
   * Genera el nombre a mostrar según la lógica definida.
   */
  const getDisplayName = (): string => {
    const hasName = branch.name !== null && branch.name.trim() !== '';
    const hasLocation = branch.location !== null;

    // Caso 1: Sin name, sin location → "Sucursal N"
    if (!hasName && !hasLocation) {
      return `Sucursal ${displayIndex}`;
    }

    // Caso 2: Sin name, con location → "Dirección completa"
    if (!hasName && hasLocation && branch.location) {
      const { address, city, state, country } = branch.location;
      return `${address}, ${city}, ${state}, ${country}`;
    }

    // Caso 3: Con name, sin location → "Nombre"
    if (hasName && !hasLocation) {
      return branch.name!;
    }

    // Caso 4: Con name, con location → "Nombre - Dirección corta"
    if (hasName && hasLocation && branch.location) {
      const { address, postalCode } = branch.location;
      const shortAddress = postalCode ? `${address}, ${postalCode}` : address;
      return `${branch.name} - ${shortAddress}`;
    }

    return `Sucursal ${displayIndex}`;
  };
  // #end-function

  // #section return
  return (
    <div className={styles.accordion}>
      {/* #section Header */}
      <div 
        className={styles.header}
        onClick={handleToggle}
        style={{ cursor: isExpandable ? 'pointer' : 'default' }}
      >
        {/* #section Header Left - show branch data */}
        <div className={styles.headerLeft}>
          {/* Solo mostrar flecha si es expandible */}
          {isExpandable && (
            <span className={`${styles.expandIcon} ${isExpanded ? styles.isExpanded : ''}`}>
              ▶
            </span>
          )}
          
          <span className={styles.branchName}>
            {getDisplayName()}
          </span>
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
      {isExpanded && isExpandable && (
        <div className={styles.children}>
          {children}
        </div>
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default BranchAccordion;
// #end-component
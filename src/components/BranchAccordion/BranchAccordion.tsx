/* src/components/BranchAccordion/BranchAccordion.tsx */
// #section imports
import { useState } from 'react';
import type { BranchWithLocation } from '../../store/Branches.types';
import styles from './BranchAccordion.module.css';
// #end-section

// #interface BranchAccordionProps
interface BranchAccordionProps {
  branch: BranchWithLocation;
  displayIndex: number;
  onEditLocation: () => void;
  onEditName: () => void;
  onEditSocials: () => void;
  onDelete: () => void;
}
// #end-interface

// #component BranchAccordion
/**
 * Acordeón colapsable para cada sucursal.
 * Muestra nombre, dirección y código postal en el header.
 * Al expandir, muestra opciones de configuración.
 */
const BranchAccordion = ({
  branch,
  displayIndex,
  onEditLocation,
  onEditName,
  onEditSocials,
  onDelete
}: BranchAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className={styles.accordion}>
      {/* #section Header*/}
      <div 
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.headerLeft}>
          <span className={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </span>
          <span className={styles.branchName}>
            {getDisplayName()}
          </span>          
        </div>

        <div className={styles.headerRight}>
          <button 
            className="btn-sec btn-sm" 
            onClick={onEditName}
          >
            ✏️ Nombre
          </button>
          <button 
            className="btn-sec btn-sm" 
            onClick={onEditLocation}
          >
            📍 Ubicación
          </button>
        </div>
      </div>
      {/* #end-section */}
      {/* #section Expanded content */}
      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.configSection}>
            <h4 className={styles.configTitle}>⚙️ Configuración de la Sucursal</h4>
            <div className={styles.configGrid}>
              <button 
                className="btn-sec btn-sm" 
                onClick={onEditSocials}
              >
                🌐 Redes Sociales
              </button>
              <button 
                className="btn-danger btn-sm" 
                onClick={onDelete}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* #end-section */}
    </div>
  );
};

export default BranchAccordion;
// #end-component
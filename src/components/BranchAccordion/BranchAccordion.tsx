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

    // Caso 4: Con name, con location → "Nombre - Dirección"
    if (hasName && hasLocation && branch.location) {
      const { address, city, state } = branch.location;
      return `${branch.name} - ${address}, ${city}, ${state}`;
    }

    return `Sucursal ${displayIndex}`;
  };
  // #end-function

  const displayName = getDisplayName();
  const hasLocation = branch.location !== null;

  return (
    <div className={styles.accordion}>
      {/* Header del acordeón */}
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerLeft}>
          <div className={styles.icon}>📍</div>
          
          <div className={styles.info}>
            <h5 className={styles.name}>{displayName}</h5>
            
            {hasLocation && branch.location && (
              <div className={styles.details}>
                <span className={styles.address}>
                  {branch.location.address}, {branch.location.city}
                </span>
                {branch.location.postalCode && (
                  <span className={styles.postalCode}>
                    CP: {branch.location.postalCode}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className="btn-sec btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditName();
            }}
            title="Editar nombre"
          >
            ✏️ Editar
          </button>
          
          <button
            className="btn-sec btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Eliminar sucursal"
            style={{ color: '#dc2626' }}
          >
            🗑️ Eliminar
          </button>

          <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className={styles.content}>
          <h6 className={styles.sectionTitle}>Configuración de Sucursal</h6>
          
          <div className={styles.configGrid}>
            {/* Ubicación */}
            <button className={styles.configButton} onClick={onEditLocation}>
              <span className={styles.configIcon}>📍</span>
              <span className={styles.configLabel}>Ubicación</span>
              <span className={styles.configArrow}>→</span>
            </button>

            {/* Empleados */}
            <button className={styles.configButton} disabled title="Próximamente">
              <span className={styles.configIcon}>👥</span>
              <span className={styles.configLabel}>Empleados</span>
              <span className={styles.configArrow}>→</span>
            </button>

            {/* Productos */}
            <button className={styles.configButton} disabled title="Próximamente">
              <span className={styles.configIcon}>📦</span>
              <span className={styles.configLabel}>Productos</span>
              <span className={styles.configArrow}>→</span>
            </button>

            {/* Redes Sociales */}
            <button className={styles.configButton} disabled title="Próximamente">
              <span className={styles.configIcon}>🌐</span>
              <span className={styles.configLabel}>Redes Sociales</span>
              <span className={styles.configArrow}>→</span>
            </button>

            {/* Horarios */}
            <button className={styles.configButton} disabled title="Próximamente">
              <span className={styles.configIcon}>🕐</span>
              <span className={styles.configLabel}>Horarios</span>
              <span className={styles.configArrow}>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchAccordion;
// #end-component
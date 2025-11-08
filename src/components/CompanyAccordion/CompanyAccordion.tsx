/* src/components/CompanyAccordion/CompanyAccordion.tsx */
// #section imports
import { useState } from 'react';
import type { Company } from '../../store/Companies.types';
import { useBranches } from '../../hooks/useBranches';
import BranchList from '../BranchList/BranchList';
import BranchLocationModal from '../BranchLocationModal/BranchLocationModal';
import BranchNameModal from '../BranchNameModal/BranchNameModal';
import type { BranchWithLocation } from '../../store/Branches.types';
import styles from './CompanyAccordion.module.css';
// #end-section

// #interface CompanyAccordionProps
interface CompanyAccordionProps {
  company: Company;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
// #end-interface

// #component CompanyAccordion
const CompanyAccordion = ({ company, isExpanded, onToggle, onEdit, onDelete }: CompanyAccordionProps) => {
  const {
    branches,
    isLoading,
    loadBranches,
    createBranch,
    updateBranchName,
    deleteBranch,
    saveLocation,
  } = useBranches(company.id);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchWithLocation | null>(null);

  // Cargar sucursales cuando se expande
  const handleToggle = async () => {
    if (!isExpanded) {
      // Se está expandiendo, cargar sucursales
      await loadBranches();
    }
    onToggle();
  };

  const handleCreateBranch = async () => {
    try {
      await createBranch({ companyId: company.id });
    } catch (error) {
      console.error('Error creando sucursal:', error);
    }
  };

  const handleEditLocation = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowLocationModal(true);
  };

  const handleEditName = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowNameModal(true);
  };

  const handleDeleteBranch = async (branchId: number) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        await deleteBranch(branchId);
      } catch (error) {
        console.error('Error eliminando sucursal:', error);
      }
    }
  };

  const handleSaveLocation = async (data: Parameters<typeof saveLocation>[1]) => {
    if (!selectedBranch) return;
    try {
      await saveLocation(selectedBranch.id, data);
      setShowLocationModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error guardando ubicación:', error);
    }
  };

  const handleSaveName = async (name: string | null) => {
    if (!selectedBranch) return;
    try {
      await updateBranchName(selectedBranch.id, name);
      setShowNameModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error actualizando nombre:', error);
    }
  };

  return (
    <>
      <div className={styles.accordion}>
        {/* Header del acordeón */}
        <div className={styles.header} onClick={handleToggle}>
          <div className={styles.headerLeft}>
            {/* Logo o inicial */}
            <div className={styles.logo}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} />
              ) : (
                <span>{company.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            
            {/* Info de la compañía */}
            <div className={styles.info}>
              <h3 className={styles.name}>{company.name}</h3>
              {company.description && (
                <p className={styles.description}>{company.description}</p>
              )}
            </div>
          </div>

          {/* Botón de expandir/colapsar */}
          <div className={styles.headerRight}>
            <span className={styles.arrow}>{isExpanded ? '▼' : '▶'}</span>
          </div>
        </div>

        {/* Contenido expandible */}
        {isExpanded && (
          <div className={styles.content}>
            {/* Acciones de la compañía */}
            <div className={styles.companyActions}>
              <button className="btn-sec btn-sm" onClick={onEdit}>
                ✏️ Editar Compañía
              </button>
              <button className="btn-sec btn-sm" onClick={onDelete}>
                🗑️ Eliminar Compañía
              </button>
            </div>

            {/* Sección de sucursales */}
            <div className={styles.branchesSection}>
              <div className={styles.branchesHeader}>
                <h4 className={styles.sectionTitle}>Sucursales</h4>
                <button className="btn-pri btn-sm" onClick={handleCreateBranch} disabled={isLoading}>
                  + Agregar Sucursal
                </button>
              </div>

              {isLoading && <p className={styles.loading}>Cargando sucursales...</p>}

              {!isLoading && branches.length === 0 && (
                <p className={styles.emptyMessage}>
                  No hay sucursales. Crea la primera para comenzar.
                </p>
              )}

              {!isLoading && branches.length > 0 && (
                <BranchList
                  branches={branches}
                  onEditLocation={handleEditLocation}
                  onEditName={handleEditName}
                  onDelete={handleDeleteBranch}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {showLocationModal && selectedBranch && (
        <BranchLocationModal
          branch={selectedBranch}
          onClose={() => {
            setShowLocationModal(false);
            setSelectedBranch(null);
          }}
          onSave={handleSaveLocation}
        />
      )}

      {showNameModal && selectedBranch && (
        <BranchNameModal
          branch={selectedBranch}
          onClose={() => {
            setShowNameModal(false);
            setSelectedBranch(null);
          }}
          onSave={handleSaveName}
        />
      )}
    </>
  );
};

export default CompanyAccordion;
// #end-component
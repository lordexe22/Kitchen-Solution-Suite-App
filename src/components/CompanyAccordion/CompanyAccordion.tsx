/* src/components/CompanyAccordion/CompanyAccordion.tsx */
// #section imports
import { useState } from 'react';
import type { Company } from '../../store/Companies.types';
import { useBranches } from '../../hooks/useBranches';
import BranchList from '../BranchList/BranchList';
import BranchLocationModal from '../BranchLocationModal/BranchLocationModal';
import BranchNameModal from '../BranchNameModal/BranchNameModal';
import BranchSocialsModal from '../BranchSocialsModal/BranchSocialsModal';
import type { BranchWithLocation } from '../../store/Branches.types';
import styles from './CompanyAccordion.module.css';
import type { BranchLocationFormData } from '../../store/Branches.types';
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
    loadBranchSocials,
    createSocial,
    updateSocial,
    deleteSocial,
    applySocialsToAllBranches
  } = useBranches(company.id);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSocialsModal, setShowSocialsModal] = useState(false);
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

  const handleEditSocials = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowSocialsModal(true);
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

  const handleSaveLocation = async (data: BranchLocationFormData) => {
    if (!selectedBranch) return;
    try {
      await saveLocation(selectedBranch.id, data);
      await loadBranches(true); // Refrescar
      setShowLocationModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error guardando ubicación:', error);
      throw error;
    }
  };

  const handleSaveName = async (name: string | null) => {
    if (!selectedBranch) return;
    try {
      await updateBranchName(selectedBranch.id, name);
      await loadBranches(true); // Refrescar
      setShowNameModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error guardando nombre:', error);
      throw error;
    }
  };

  return (
    <>
      <div className={styles.accordion}>
        {/* Header del acordeón */}
        <div className={styles.header} onClick={handleToggle}>
          <div className={styles.headerLeft}>
            <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
            <h3 className={styles.companyName}>{company.name}</h3>
            {company.description && (
              <span className={styles.description}>{company.description}</span>
            )}
          </div>
          <div className={styles.headerRight} onClick={(e) => e.stopPropagation()}>
            <button className="btn-sec btn-sm" onClick={onEdit}>
              ✏️ Editar
            </button>
            <button className="btn-danger btn-sm" onClick={onDelete}>
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {/* Contenido expandido */}
        {isExpanded && (
          <div className={styles.content}>
            <div className={styles.branchesSection}>
              <div className={styles.branchesHeader}>
                <h4 className={styles.sectionTitle}>Sucursales</h4>
                <button
                  className="btn-pri btn-sm"
                  onClick={handleCreateBranch}
                  disabled={isLoading}
                >
                  + Nueva Sucursal
                </button>
              </div>

              {isLoading && branches.length === 0 && (
                <p className={styles.loading}>Cargando sucursales...</p>
              )}

              {!isLoading && branches.length === 0 && (
                <p className={styles.empty}>
                  No hay sucursales. Crea la primera para comenzar.
                </p>
              )}

              {!isLoading && branches.length > 0 && (
                <BranchList
                  branches={branches}
                  onEditLocation={handleEditLocation}
                  onEditName={handleEditName}
                  onEditSocials={handleEditSocials}
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

      {showSocialsModal && selectedBranch && (
        <BranchSocialsModal
          branch={selectedBranch}
          companyId={company.id}
          totalBranches={branches.length}
          onClose={() => {
            setShowSocialsModal(false);
            setSelectedBranch(null);
          }}
          onLoadSocials={loadBranchSocials}
          onCreateSocial={createSocial}
          onUpdateSocial={updateSocial}
          onDeleteSocial={deleteSocial}
          onApplyToAll={applySocialsToAllBranches}
        />
      )}
    </>
  );
};

export default CompanyAccordion;
// #end-component
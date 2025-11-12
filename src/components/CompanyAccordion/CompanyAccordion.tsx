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
  // #hook useBranches
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
  // #end-hook
  // #state [showLocationModal, setShowLocationModal]
  const [showLocationModal, setShowLocationModal] = useState(false);
  // #end-state
  // #state [showNameModal, setShowNameModal]
  const [showNameModal, setShowNameModal] = useState(false);
  // #end-state
  // #state [showSocialsModal, setShowSocialsModal]
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  // #end-state
  // #state [selectedBranch, setSelectedBranch]
  const [selectedBranch, setSelectedBranch] = useState<BranchWithLocation | null>(null);
  // #end-state
  // #event handleToggle - fetch branches if expand company's branches
  const handleToggle = async () => {
    if (!isExpanded) {
      await loadBranches();
    }
    onToggle();
  };
  // #end-event
  // #event handleCreateBranch
  const handleCreateBranch = async () => {
    try {
      await createBranch({ companyId: company.id });
    } catch (error) {
      console.error('Error creando sucursal:', error);
    }
  };
  // #end-event
  // #event handleEditLocation
  const handleEditLocation = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowLocationModal(true);
  };
  // #end-event
  // #event handleEditName
  const handleEditName = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowNameModal(true);
  };
  // #end-event
  // #event handleEditSocials
  const handleEditSocials = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowSocialsModal(true);
  };
  // #end-event
  // #event handleDeleteBranch
  const handleDeleteBranch = async (branchId: number) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        await deleteBranch(branchId);
      } catch (error) {
        console.error('Error eliminando sucursal:', error);
      }
    }
  };
  // #end-event
  // #event handleSaveLocation
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
  // #end-event
  // #event handleSaveName
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
  // #end-event
  // #section return
  return (
    <>
      <div className={styles.accordion}>
        {/* #section Header */}
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
        {/* #end-section */}
        {/* #section Expanded content of a specific branch */}
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
        {/* #end-section */}
      </div>


      {/* #section Modal for create new branches */}
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
      {/* #end-section */}
      {/* #section Modal for edit the branch's name */}
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
      {/* #end-section */}
      {/* #section Modal for edit Social Media branch data */}
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
      {/* #end-section */}
    </>
  );
  // #end-section
};

export default CompanyAccordion;
// #end-component
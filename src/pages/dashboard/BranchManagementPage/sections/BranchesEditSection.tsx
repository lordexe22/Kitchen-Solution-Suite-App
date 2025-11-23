// src/pages/dashboard/BranchManagementPage/sections/BranchesEditSection.tsx

import { useEffect, useState } from 'react';
import BranchAccordion from '../../../../components/BranchAccordion/BranchAccordion';
import BranchNameModal from '../../../../components/BranchNameModal/BranchNameModal';
import { useBranches } from '../../../../hooks/useBranches';
import type { BranchWithLocation } from '../../../../store/Branches.types';
import type { BranchSectionProps } from '../BranchManagementPage.types';
import styles from '../BranchManagementPage.module.css';

// #component BranchesEditSection
/**
 * Componente que maneja la sección de edición de sucursales.
 * Permite crear, renombrar y eliminar sucursales.
 */
const BranchesEditSection = ({ companyId, onError = () => {} }: BranchSectionProps) => {
  // #hook useBranches
  const { branches, isLoading, loadBranches, createBranch, updateBranchName, deleteBranch } = useBranches(companyId);
  // #end-hook

  // #state [showNameModal, setShowNameModal]
  const [showNameModal, setShowNameModal] = useState(false);
  // #end-state

  // #state [selectedBranch, setSelectedBranch]
  const [selectedBranch, setSelectedBranch] = useState<BranchWithLocation | null>(null);
  // #end-state

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #event handleCreateBranch
  const handleCreateBranch = async () => {
    try {
      await createBranch({ companyId });
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error creando sucursal');
      console.error('Error creando sucursal:', error);
    }
  };
  // #end-event

  // #event handleEditName
  const handleEditName = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowNameModal(true);
  };
  // #end-event

  // #event handleDeleteBranch
  const handleDeleteBranch = async (branchId: number) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        await deleteBranch(branchId);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Error eliminando sucursal');
        console.error('Error eliminando sucursal:', error);
      }
    }
  };
  // #end-event

  // #event handleSaveName
  const handleSaveName = async (name: string | null) => {
    if (!selectedBranch) return;
    try {
      await updateBranchName(selectedBranch.id, name);
      await loadBranches(true);
      setShowNameModal(false);
      setSelectedBranch(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error guardando nombre');
      console.error('Error guardando nombre:', error);
      throw error;
    }
  };
  // #end-event

  // #section return
  return (
    <>
      <div className={styles.branchesSection}>
        {/* #section Header */}
        <div className={styles.branchesHeader}>
          <h4 className={styles.sectionTitle}>Sucursales</h4>
          <button className="btn-pri btn-sm" onClick={handleCreateBranch} disabled={isLoading}>
            + Nueva Sucursal
          </button>
        </div>
        {/* #end-section */}

        {/* #section Loading state */}
        {isLoading && branches.length === 0 && <p className={styles.loading}>Cargando sucursales...</p>}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && branches.length === 0 && (
          <p className={styles.emptyMessage}>No hay sucursales. Crea la primera para comenzar.</p>
        )}
        {/* #end-section */}

        {/* #section Branch list */}
        {!isLoading && branches.length > 0 && (
          <div className={styles.branchList}>
            {branches.map((branch, index) => (
              <BranchAccordion
                key={branch.id}
                branch={branch}
                displayIndex={index + 1}
                onEdit={() => handleEditName(branch)}
                onDelete={() => handleDeleteBranch(branch.id)}
              />
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>

      {/* #section Modal for edit branch name */}
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
    </>
  );
};

export default BranchesEditSection;

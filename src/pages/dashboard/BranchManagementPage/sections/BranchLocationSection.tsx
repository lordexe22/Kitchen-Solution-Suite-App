// src/pages/dashboard/BranchManagementPage/sections/BranchLocationSection.tsx

import { useEffect, useState } from 'react';
import BranchAccordion from '../../../../components/BranchAccordion/BranchAccordion';
import BranchLocationRow from '../../../../components/BranchLocationRow/BranchLocationRow';
import { useBranches } from '../../../../hooks/useBranches';
import type { BranchLocationFormData } from '../../../../store/Branches.types';
import type { BranchSectionProps } from '../BranchManagementPage.types';
import styles from '../BranchManagementPage.module.css';

const BranchLocationSection = ({ companyId, onError = () => {} }: BranchSectionProps) => {
  const { branches, isLoading, loadBranches, saveLocation, deleteLocation, updateBranchInStore } = useBranches(companyId);

  const [branchLocationsMap, setBranchLocationsMap] = useState<Map<number, BranchLocationFormData | null>>(new Map());
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    // Initialize map from branches
    const map = new Map<number, BranchLocationFormData | null>();
    branches.forEach((b) => map.set(b.id, b.location || null));
    setBranchLocationsMap(map);
  }, [branches]);

  const handleSaveLocation = async (branchId: number, data: BranchLocationFormData) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      const loc = await saveLocation(branchId, data);
      // update local map
      setBranchLocationsMap((prev) => new Map(prev).set(branchId, loc));
      updateBranchInStore(branchId, { location: loc });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar ubicación';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };

  const handleDeleteLocation = async (branchId: number) => {
    if (!confirm('¿Eliminar la ubicación de esta sucursal?')) return;
    setLoadingBranchId(branchId);
    onError('');

    try {
      await deleteLocation(branchId);
      setBranchLocationsMap((prev) => new Map(prev).set(branchId, null));
      updateBranchInStore(branchId, { location: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar ubicación';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };

  return (
    <div className={styles.branchesSection}>
      <div className={styles.branchesHeader}>
        <h4 className={styles.sectionTitle}>Sucursales</h4>
      </div>

      {(isLoading) && branches.length === 0 && <p className={styles.loading}>Cargando ubicaciones...</p>}

      {!isLoading && branches.length === 0 && (
        <p className={styles.emptyMessage}>No hay sucursales en esta compañía.</p>
      )}

      {branches.length > 0 && (
        <div className={styles.branchList}>
          {branches.map((branch, index) => (
            <BranchAccordion key={branch.id} branch={branch} displayIndex={index + 1} expandable={true}>
              <BranchLocationRow
                branch={branch}
                companyId={companyId}
                location={branchLocationsMap.get(branch.id) || null}
                onSaveLocation={handleSaveLocation}
                onDeleteLocation={handleDeleteLocation}
                isLoading={loadingBranchId === branch.id}
              />
            </BranchAccordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchLocationSection;

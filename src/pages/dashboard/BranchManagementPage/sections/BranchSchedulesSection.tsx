// src/pages/dashboard/BranchManagementPage/sections/BranchSchedulesSection.tsx

import { useEffect, useState } from 'react';
import BranchAccordion from '../../../../components/BranchAccordion/BranchAccordion';
import ScheduleRow from '../../../../components/ScheduleRow/ScheduleRow';
import { useBranches } from '../../../../hooks/useBranches';
import type { BranchSchedule } from '../../../../store/Branches.types';
import type { BranchSectionProps } from '../BranchManagementPage.types';
import styles from '../BranchManagementPage.module.css';

// #interface CopiedSchedulesConfig
/**
 * Configuración copiada con el ID de la compañía para validar
 */
interface CopiedSchedulesConfig {
  companyId: number;
  schedules: BranchSchedule[];
}
// #end-interface

interface BranchSchedulesSectionProps extends BranchSectionProps {
  copiedConfig?: CopiedSchedulesConfig | null;
  onCopyConfig?: (config: CopiedSchedulesConfig | null) => void;
}

// #component BranchSchedulesSection
/**
 * Componente que maneja la sección de horarios de sucursales.
 * Carga branches, schedules y renderiza BranchAccordion expandibles.
 */
const BranchSchedulesSection = ({
  companyId,
  onError = () => {},
  copiedConfig = null,
  onCopyConfig = () => {},
}: BranchSchedulesSectionProps) => {
  // #hook useBranches
  const {
    branches,
    isLoading,
    loadBranches,
    loadBranchSchedules,
    updateSchedules,
    updateBranchSchedules,
  } = useBranches(companyId);
  // #end-hook

  // #state [branchSchedulesMap, setBranchSchedulesMap]
  const [branchSchedulesMap, setBranchSchedulesMap] = useState<Map<number, BranchSchedule[]>>(new Map());
  // #end-state

  // #state [isLoadingSchedules, setIsLoadingSchedules]
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  // #end-state

  // #state [loadingBranchId, setLoadingBranchId]
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);
  // #end-state

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #effect - Load schedules when branches are available
  useEffect(() => {
    if (branches.length > 0 && !isLoadingSchedules) {
      const needsSchedules = branches.some((branch) => !branchSchedulesMap.has(branch.id));

      if (needsSchedules) {
        setIsLoadingSchedules(true);

        Promise.all(
          branches.map(async (branch) => {
            if (!branchSchedulesMap.has(branch.id)) {
              try {
                const schedules = await loadBranchSchedules(branch.id);
                setBranchSchedulesMap((prev) => new Map(prev).set(branch.id, schedules));
                updateBranchSchedules(branch.id, schedules);
              } catch (err) {
                console.error(`Error loading schedules for branch ${branch.id}:`, err);
              }
            }
          })
        ).finally(() => {
          setIsLoadingSchedules(false);
        });
      }
    }
  }, [branches, loadBranchSchedules, updateBranchSchedules, isLoadingSchedules, branchSchedulesMap]);
  // #end-effect

  // #event handleUpdateSchedules
  const handleUpdateSchedules = async (branchId: number, schedules: BranchSchedule[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      const schedulesData = schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime,
        closeTime: s.closeTime,
        isClosed: s.isClosed,
      }));

      const updatedSchedules = await updateSchedules(branchId, schedulesData);

      // Actualizar en el mapa local
      setBranchSchedulesMap((prev) => new Map(prev).set(branchId, updatedSchedules));
      updateBranchSchedules(branchId, updatedSchedules);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar horarios';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
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
        </div>
        {/* #end-section */}

        {/* #section Loading state */}
        {(isLoading || isLoadingSchedules) && branches.length === 0 && (
          <p className={styles.loading}>Cargando horarios...</p>
        )}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && !isLoadingSchedules && branches.length === 0 && (
          <p className={styles.emptyMessage}>No hay sucursales en esta compañía.</p>
        )}
        {/* #end-section */}

        {/* #section Branch list */}
        {branches.length > 0 && (
          <div className={styles.branchList}>
            {branches.map((branch, index) => (
              <BranchAccordion
                key={branch.id}
                branch={branch}
                displayIndex={index + 1}
                expandable={true}
              >
                <ScheduleRow
                  branch={branch}
                  companyId={companyId}
                  schedules={branchSchedulesMap.get(branch.id) || []}
                  onUpdateSchedules={handleUpdateSchedules}
                  copiedConfig={copiedConfig}
                  onCopyConfig={onCopyConfig}
                  isLoading={loadingBranchId === branch.id}
                />
              </BranchAccordion>
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>
    </>
  );
};

export default BranchSchedulesSection;

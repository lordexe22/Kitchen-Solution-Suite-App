/* src/pages/dashboard/SchedulesPage/SchedulesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import ScheduleRow from '../../../components/ScheduleRow/ScheduleRow';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { BranchSchedule } from '../../../store/Branches.types';
import styles from './SchedulePage.module.css';
// #end-section

// #component SchedulesPage
const SchedulesPage = () => {
  // #variable appLogoUrl
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  // #end-variable

  // #hook useCompanies
  const { 
    companies, 
    loadCompanies, 
    isLoading: isLoadingCompanies 
  } = useCompanies();
  // #end-hook

  // #state [error, setError]
  const [error, setError] = useState<string | null>(null);
  // #end-state

  // #effect - Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-effect

  // #section return
  return (
    <div className={styles.container}>
      {/* #section AppHeader */}
      <AppHeader
        appLogoUrl={appLogoUrl}
        appName="Kitchen Solutions"
        onLogin={() => {}}
        onLogout={() => {}}
      />
      {/* #end-section */}

      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          {/* #section Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>🕐 Horarios de Atención</h1>
            <p className={styles.subtitle}>
              Configura los horarios de todas tus sucursales. Click en cada día para editar.
            </p>
          </div>
          {/* #end-section */}

          {/* #section Error */}
          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          {/* #end-section */}

          {/* #section Loading */}
          {isLoadingCompanies && (
            <div className={styles.loading}>Cargando compañías...</div>
          )}
          {/* #end-section */}

          {/* #section Empty State */}
          {!isLoadingCompanies && companies.length === 0 && (
            <EmptyState
              title="No hay compañías"
              description="Crea tu primera compañía para comenzar a configurar horarios"
              actionButtonText="Ir a Compañías"
              onActionClick={() => window.location.href = '/dashboard/companies'}
              icon="🏢"
            />
          )}
          {/* #end-section */}

          {/* #section Companies List */}
          {companies.length > 0 && (
            <div className={styles.accordionList}>
              {companies.map((company) => (
                <CompanyAccordion
                  key={company.id}
                  company={company}
                >
                  <BranchSchedulesSection 
                    companyId={company.id} 
                    onError={setError}
                  />
                </CompanyAccordion>
              ))}
            </div>
          )}
          {/* #end-section */}
        </main>
      </div>
    </div>
  );
  // #end-section
};

export default SchedulesPage;
// #end-component

// #component BranchSchedulesSection
/**
 * Componente interno que maneja la sección de horarios de sucursales.
 * Carga branches, schedules y renderiza BranchAccordion expandibles.
 */
function BranchSchedulesSection({ 
  companyId, 
  onError 
}: { 
  companyId: number; 
  onError: (error: string) => void;
}) {
  // #hook useBranches
  const { 
    branches, 
    isLoading,
    loadBranches, 
    loadBranchSchedules, 
    updateSchedules, 
    applySchedulesToAll,
    updateBranchSchedules 
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
      const needsSchedules = branches.some(branch => !branchSchedulesMap.has(branch.id));
      
      if (needsSchedules) {
        setIsLoadingSchedules(true);
        
        Promise.all(
          branches.map(async (branch) => {
            if (!branchSchedulesMap.has(branch.id)) {
              try {
                const schedules = await loadBranchSchedules(branch.id);
                setBranchSchedulesMap(prev => new Map(prev).set(branch.id, schedules));
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
      const schedulesData = schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime,
        closeTime: s.closeTime,
        isClosed: s.isClosed
      }));

      const updatedSchedules = await updateSchedules(branchId, schedulesData);
      setBranchSchedulesMap(prev => new Map(prev).set(branchId, updatedSchedules));
      updateBranchSchedules(branchId, updatedSchedules);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar horarios';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };
  // #end-event

  // #event handleApplyToAll
  const handleApplyToAll = async (sourceBranchId: number) => {
    onError('');
    setLoadingBranchId(sourceBranchId);

    try {
      await applySchedulesToAll(sourceBranchId);
      
      // Recargar horarios de todas las sucursales
      setIsLoadingSchedules(true);
      await Promise.all(
        branches.map(async (branch) => {
          const schedules = await loadBranchSchedules(branch.id);
          setBranchSchedulesMap(prev => new Map(prev).set(branch.id, schedules));
          updateBranchSchedules(branch.id, schedules);
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar horarios';
      onError(errorMessage);
    } finally {
      setIsLoadingSchedules(false);
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
          <p className={styles.emptyMessage}>
            No hay sucursales en esta compañía.
          </p>
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
                  schedules={branchSchedulesMap.get(branch.id) || []}
                  onUpdateSchedules={handleUpdateSchedules}
                  onApplyToAll={handleApplyToAll}
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
  // #end-section
}
// #end-component
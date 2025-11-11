/* src/pages/dashboard/SchedulesPage/SchedulesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import ScheduleRow from '../../../components/ScheduleRow/ScheduleRow';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { BranchSchedule } from '../../../store/Branches.types';
import type { Company } from '../../../store/Companies.types';
import styles from './SchedulePage.module.css';
// #end-section
// #component SchedulesPage
const SchedulesPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  const { companies, loadCompanies, isLoading: isLoadingCompanies } = useCompanies();
  const [error, setError] = useState<string | null>(null);

  // Cargar empresas al montar
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return (
    <div className={styles.container}>
      <AppHeader
        appLogoUrl={appLogoUrl}
        appName="Kitchen Solutions"
        onLogin={() => {}}
        onLogout={() => {}}
      />
      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>🕐 Horarios de Atención</h1>
            <p className={styles.subtitle}>
              Configura los horarios de todas tus sucursales. Click en cada día para editar.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* Loading */}
          {isLoadingCompanies && (
            <div className={styles.loading}>Cargando empresas...</div>
          )}

          {/* Empty State */}
          {!isLoadingCompanies && companies.length === 0 && (
            <EmptyState
              title="No hay empresas"
              description="Crea tu primera empresa para comenzar a configurar horarios"
              actionButtonText="Ir a Compañías"
              onActionClick={() => window.location.href = '/dashboard/companies'}
              icon="🏢"
            />
          )}

          {/* Lista de empresas con sus sucursales */}
          {companies.length > 0 && (
            <div className={styles.companiesList}>
              {companies.map(company => (
                <CompanySchedulesSection
                  key={company.id}
                  company={company}
                  onError={setError}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SchedulesPage;
// #end-component
// #component CompanySchedulesSection
/**
 * Sección de horarios para una compañía.
 * Carga sucursales y horarios automáticamente al montar.
 */
interface CompanySchedulesSectionProps {
  company: Company;
  onError: (error: string) => void;
}

const CompanySchedulesSection = ({ company, onError }: CompanySchedulesSectionProps) => {
  const { 
    branches, 
    loadBranches, 
    isLoading: isLoadingBranches, 
    loadBranchSchedules, 
    updateSchedules, 
    applySchedulesToAll,
    updateBranchSchedules 
  } = useBranches(company.id);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [branchSchedulesMap, setBranchSchedulesMap] = useState<Map<number, BranchSchedule[]>>(new Map());

  // ✅ CARGAR SUCURSALES AL MONTAR (no al expandir)
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  // ✅ CARGAR HORARIOS CUANDO LAS SUCURSALES ESTÉN DISPONIBLES
  useEffect(() => {
    if (branches.length > 0 && !isLoadingSchedules) {
      // Verificar si ya se cargaron los horarios
      const needsSchedules = branches.some(branch => !branchSchedulesMap.has(branch.id));
      
      if (needsSchedules) {
        setIsLoadingSchedules(true);
        
        // Cargar horarios en paralelo
        Promise.all(
          branches.map(async (branch) => {
            // Solo cargar si no tiene horarios ya
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

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

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
      
      // Actualizar en el mapa local
      setBranchSchedulesMap(prev => new Map(prev).set(branchId, updatedSchedules));
      updateBranchSchedules(branchId, updatedSchedules);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar horarios';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };

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

  return (
    <div className={styles.companySection}>
      {/* Header del acordeón */}
      <button
        className={`${styles.companyHeader} ${isExpanded ? styles.expanded : ''}`}
        onClick={handleToggle}
      >
        <div className={styles.companyInfo}>
          <h3 className={styles.companyName}>
            {company.logoUrl && (
              <img src={company.logoUrl} alt={company.name} className={styles.companyLogo} />
            )}
            {company.name}
          </h3>
          {company.description && (
            <p className={styles.companyDescription}>{company.description}</p>
          )}
        </div>
        <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className={styles.companyContent}>
          {(isLoadingBranches || isLoadingSchedules) && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando horarios...</p>
            </div>
          )}

          {!isLoadingBranches && !isLoadingSchedules && branches.length === 0 && (
            <div className={styles.emptyState}>
              <p>No hay sucursales en esta compañía</p>
            </div>
          )}

          {!isLoadingBranches && !isLoadingSchedules && branches.length > 0 && (
            <div className={styles.branchesGrid}>
              {branches.map((branch) => (
                <ScheduleRow
                  key={branch.id}
                  branch={branch}
                  schedules={branchSchedulesMap.get(branch.id) || []}
                  onUpdateSchedules={handleUpdateSchedules}
                  onApplyToAll={handleApplyToAll}
                  isLoading={loadingBranchId === branch.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// #end-component
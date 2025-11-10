/* src/pages/dashboard/SchedulesPage/SchedulesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import ScheduleRow from '../../../components/ScheduleRow/ScheduleRow';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { BranchSchedule, BranchScheduleFormData } from '../../../store/Branches.types';
import type { Company } from '../../../store/Companies.types';
import styles from './SchedulePage.module.css';
import { DAYS_OF_WEEK } from '../../../store/Branches.types';
import type { BranchWithSchedules } from '../../../store/Branches.types';
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
 * Componente que muestra una empresa con sus sucursales y horarios.
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

  // Cargar horarios cuando las sucursales cambian y el acordeón está expandido
  useEffect(() => {
    if (isExpanded && branches.length > 0 && !isLoadingSchedules) {
      // Verificar si ya se cargaron los horarios
      const needsSchedules = branches.some(branch => !branch.schedules || branch.schedules.length === 0);
      
      if (needsSchedules) {
        setIsLoadingSchedules(true);
        
        // Cargar horarios en paralelo
        Promise.all(
          branches.map(async (branch) => {
            // Solo cargar si no tiene horarios ya
            if (!branch.schedules || branch.schedules.length === 0) {
              try {
                const schedules = await loadBranchSchedules(branch.id);
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
  }, [isExpanded, branches, loadBranchSchedules, updateBranchSchedules, isLoadingSchedules]);

  // Cargar sucursales cuando se expande
  const handleToggle = async () => {
    if (!isExpanded) {
      await loadBranches();
    }
    setIsExpanded(!isExpanded);
  };

  const handleUpdateSchedules = async (branchId: number, schedules: BranchSchedule[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      // Convertir a formato que espera el backend
      const schedulesData: BranchScheduleFormData[] = schedules.map(s => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime,
        closeTime: s.closeTime,
        isClosed: s.isClosed
      }));

      const updatedSchedules = await updateSchedules(branchId, schedulesData);
      
      // Actualizar en el store
      updateBranchSchedules(branchId, updatedSchedules);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar horarios';
      onError(errorMessage);
      throw err;
    } finally {
      setLoadingBranchId(null);
    }
  };

  const handleApplyToAll = async (sourceBranchId: number) => {
    setLoadingBranchId(sourceBranchId);
    onError('');

    try {
      await applySchedulesToAll(sourceBranchId);
      
      // Recargar horarios de todas las sucursales
      await loadBranches(true); // Force refresh
      
      // Esperar un tick
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Cargar horarios de cada sucursal
      await Promise.all(
        branches.map(async (branch) => {
          try {
            const schedules = await loadBranchSchedules(branch.id);
            updateBranchSchedules(branch.id, schedules);
          } catch (err) {
            console.error(`Error loading schedules for branch ${branch.id}:`, err);
          }
        })
      );
      
      alert('✅ Horarios aplicados exitosamente a todas las sucursales');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar horarios';
      onError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoadingBranchId(null);
    }
  };

  return (
    <div className={styles.companySection}>
      {/* Header de empresa */}
      <div className={styles.companyHeader} onClick={handleToggle}>
        <div className={styles.companyInfo}>
          <h2 className={styles.companyName}>
            {isExpanded ? '▼' : '▶'} 🏢 {company.name}
          </h2>
          {company.description && (
            <p className={styles.companyDescription}>{company.description}</p>
          )}
        </div>
        <div className={styles.companyBadge}>
          {branches.length} {branches.length === 1 ? 'sucursal' : 'sucursales'}
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className={styles.companyContent}>
          {(isLoadingBranches || isLoadingSchedules) && (
            <div className={styles.loading}>
              {isLoadingBranches ? 'Cargando sucursales...' : 'Cargando horarios...'}
            </div>
          )}

          {!isLoadingBranches && branches.length === 0 && (
            <p className={styles.emptyMessage}>
              No hay sucursales en esta empresa.
            </p>
          )}

          {!isLoadingBranches && branches.length > 0 && (
            <>
              {/* Encabezados de tabla */}
              <div className={styles.tableHeader}>
                <div className={styles.columnBranch}>Sucursal</div>
                {DAYS_OF_WEEK.map(day => (
                  <div key={day.value} className={styles.columnDay}>
                    {day.shortLabel}
                  </div>
                ))}
                <div className={styles.columnActions}>Acciones</div>
              </div>

              {/* Filas de sucursales */}
              {branches.map(branch => (
                <ScheduleRow
                  key={branch.id}
                  branch={branch}
                  schedules={(branch as BranchWithSchedules).schedules || []}
                  onUpdateSchedules={(branchId, schedules) => 
                    handleUpdateSchedules(branchId, schedules)
                  }
                  onApplyToAll={(branchId) => handleApplyToAll(branchId)}
                  isLoading={loadingBranchId === branch.id}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
// #end-component
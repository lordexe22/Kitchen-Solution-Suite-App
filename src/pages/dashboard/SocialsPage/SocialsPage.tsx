/* src/pages/dashboard/SocialsPage/SocialsPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import SocialRow from '../../../components/SocialRow/SocialRow';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { BranchSocial } from '../../../store/Branches.types';
import type { Company } from '../../../store/Companies.types';
import styles from './SocialsPage.module.css';
import type { BranchWithSocials } from '../../../store/Branches.types';
// #end-section

// #component SocialsPage
const SocialsPage = () => {
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
            <h1 className={styles.title}>🌐 Redes Sociales</h1>
            <p className={styles.subtitle}>
              Configura las redes sociales de todas tus sucursales. Click en cada celda para editar.
            </p>
          </div>

          {/* Error global */}
          {error && (
            <div className={styles.errorBanner}>
              ⚠️ {error}
            </div>
          )}

          {/* Loading */}
          {isLoadingCompanies && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando empresas...</p>
            </div>
          )}

          {/* Lista de empresas */}
          {!isLoadingCompanies && companies.length === 0 && (
            <EmptyState
              icon="🏢"
              title="No hay empresas"
              description="Crea una empresa para empezar a gestionar redes sociales."
            />
          )}

          {!isLoadingCompanies && companies.length > 0 && (
            <div className={styles.companiesList}>
              {companies.map((company) => (
                <CompanySocialsSection
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

export default SocialsPage;
// #end-component

// #component CompanySocialsSection
/**
 * Sección de redes sociales para una compañía.
 * Muestra un acordeón con todas las sucursales y sus redes sociales.
 */
interface CompanySocialsSectionProps {
  company: Company;
  onError: (error: string) => void;
}

const CompanySocialsSection = ({ company, onError }: CompanySocialsSectionProps) => {
  const { 
    branches, 
    loadBranches, 
    isLoading: isLoadingBranches, 
    loadBranchSocials, 
    createSocial,
    updateSocial,
    deleteSocial,
    applySocialsToAllBranches,
    updateBranchInStore
  } = useBranches(company.id);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);
  const [isLoadingSocials, setIsLoadingSocials] = useState(false);

  // Cargar redes sociales cuando las sucursales cambian y el acordeón está expandido
  useEffect(() => {
    if (isExpanded && branches.length > 0 && !isLoadingSocials) {
      // Verificar si ya se cargaron las redes sociales
      const needsSocials = branches.some(branch => {
        const branchWithSocials = branch as BranchWithSocials;
        return !branchWithSocials.socials;
      });
      
      if (needsSocials) {
        setIsLoadingSocials(true);
        
        // Cargar redes sociales en paralelo
        Promise.all(
          branches.map(async (branch) => {
            const branchWithSocials = branch as BranchWithSocials;
            // Solo cargar si no tiene redes sociales ya
            if (!branchWithSocials.socials) {
              try {
                const socials = await loadBranchSocials(branch.id);
                updateBranchInStore(branch.id, { socials });
              } catch (err) {
                console.error(`Error loading socials for branch ${branch.id}:`, err);
              }
            }
          })
        ).finally(() => {
          setIsLoadingSocials(false);
        });
      }
    }
  }, [isExpanded, branches, loadBranchSocials, updateBranchInStore, isLoadingSocials]);

  // Cargar sucursales cuando se expande
  const handleToggle = async () => {
    if (!isExpanded) {
      await loadBranches();
    }
    setIsExpanded(!isExpanded);
  };

  const handleUpdateSocials = async (branchId: number, socials: BranchSocial[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      // Actualizar en el store
      updateBranchInStore(branchId, { socials });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar redes sociales';
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
      await applySocialsToAllBranches(sourceBranchId);
      
      // Recargar todas las redes sociales
      const updatedSocials = await Promise.all(
        branches.map(branch => loadBranchSocials(branch.id))
      );

      // Actualizar en el store
      branches.forEach((branch, index) => {
        updateBranchInStore(branch.id, { socials: updatedSocials[index] });
      });

      alert('✅ Redes sociales aplicadas a todas las sucursales exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar redes sociales';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };

  const branchesWithSocials = branches as BranchWithSocials[];

  return (
    <div className={styles.companySection}>
      {/* Header del acordeón */}
      <button
        className={styles.companyHeader}
        onClick={handleToggle}
        disabled={isLoadingBranches}
      >
        <div className={styles.companyInfo}>
          <span className={styles.companyIcon}>
            {isExpanded ? '📂' : '📁'}
          </span>
          <span className={styles.companyName}>{company.name}</span>
          <span className={styles.branchCount}>
            {branches.length} {branches.length === 1 ? 'sucursal' : 'sucursales'}
          </span>
        </div>
        <span className={styles.expandIcon}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Contenido del acordeón */}
      {isExpanded && (
        <div className={styles.companyContent}>
          {isLoadingBranches || isLoadingSocials ? (
            <div className={styles.loadingSection}>
              <div className={styles.spinner}></div>
              <p>Cargando {isLoadingSocials ? 'redes sociales' : 'sucursales'}...</p>
            </div>
          ) : branches.length === 0 ? (
            <div className={styles.emptySection}>
              <p>Esta empresa no tiene sucursales.</p>
            </div>
          ) : (
            <>
              {/* Header de tabla */}
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Sucursal</div>
                <div className={styles.headerCell}>Facebook</div>
                <div className={styles.headerCell}>Instagram</div>
                <div className={styles.headerCell}>Twitter</div>
                <div className={styles.headerCell}>LinkedIn</div>
                <div className={styles.headerCell}>TikTok</div>
                <div className={styles.headerCell}>WhatsApp</div>
                <div className={styles.headerCell}>Acciones</div>
              </div>

              {/* Filas de sucursales */}
              {branchesWithSocials.map((branch) => (
                <SocialRow
                  key={branch.id}
                  branch={branch}
                  socials={branch.socials || []}
                  onUpdateSocials={handleUpdateSocials}
                  onCreateSocial={createSocial}
                  onUpdateSocial={updateSocial}
                  onDeleteSocial={deleteSocial}
                  onApplyToAll={handleApplyToAll}
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
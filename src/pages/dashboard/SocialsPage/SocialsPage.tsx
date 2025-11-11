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

          {/* Lista de empresas */}
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
 * Carga sucursales y redes sociales automáticamente al montar.
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
  const [branchSocialsMap, setBranchSocialsMap] = useState<Map<number, BranchSocial[]>>(new Map());

  // ✅ CARGAR SUCURSALES AL MONTAR (no al expandir)
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  // ✅ CARGAR REDES SOCIALES CUANDO LAS SUCURSALES ESTÉN DISPONIBLES
  useEffect(() => {
    if (branches.length > 0 && !isLoadingSocials) {
      // Verificar si ya se cargaron las redes sociales
      const needsSocials = branches.some(branch => !branchSocialsMap.has(branch.id));
      
      if (needsSocials) {
        setIsLoadingSocials(true);
        
        // Cargar redes sociales en paralelo
        Promise.all(
          branches.map(async (branch) => {
            // Solo cargar si no tiene redes sociales ya
            if (!branchSocialsMap.has(branch.id)) {
              try {
                const socials = await loadBranchSocials(branch.id);
                setBranchSocialsMap(prev => new Map(prev).set(branch.id, socials));
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
  }, [branches, loadBranchSocials, updateBranchInStore, isLoadingSocials, branchSocialsMap]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleUpdateSocials = async (branchId: number, socials: BranchSocial[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      // Actualizar en el mapa local y en el store
      setBranchSocialsMap(prev => new Map(prev).set(branchId, socials));
      updateBranchInStore(branchId, { socials });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar redes sociales';
      onError(errorMessage);
    } finally {
      setLoadingBranchId(null);
    }
  };

  const handleApplyToAll = async (sourceBranchId: number) => {
    onError('');
    setLoadingBranchId(sourceBranchId);

    try {
      await applySocialsToAllBranches(sourceBranchId);
      
      // Recargar redes sociales de todas las sucursales
      setIsLoadingSocials(true);
      await Promise.all(
        branches.map(async (branch) => {
          const socials = await loadBranchSocials(branch.id);
          setBranchSocialsMap(prev => new Map(prev).set(branch.id, socials));
          updateBranchInStore(branch.id, { socials });
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar redes sociales';
      onError(errorMessage);
    } finally {
      setIsLoadingSocials(false);
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
          {(isLoadingBranches || isLoadingSocials) && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando redes sociales...</p>
            </div>
          )}

          {!isLoadingBranches && !isLoadingSocials && branches.length === 0 && (
            <div className={styles.emptyState}>
              <p>No hay sucursales en esta compañía</p>
            </div>
          )}

          {!isLoadingBranches && !isLoadingSocials && branches.length > 0 && (
            <div className={styles.branchesGrid}>
              {branches.map((branch) => (
                <SocialRow
                  key={branch.id}
                  branch={branch}
                  socials={branchSocialsMap.get(branch.id) || []}
                  onUpdateSocials={handleUpdateSocials}
                  onCreateSocial={createSocial}
                  onUpdateSocial={updateSocial}
                  onDeleteSocial={deleteSocial}
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
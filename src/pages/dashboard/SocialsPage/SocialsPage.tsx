/* src/pages/dashboard/SocialsPage/SocialsPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import SocialRow from '../../../components/SocialRow/SocialRow';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { BranchSocial } from '../../../store/Branches.types';
import styles from './SocialsPage.module.css';
// #end-section

// #interface CopiedSocialsConfig
/**
 * Configuración copiada con el ID de la compañía para validar
 */
interface CopiedSocialsConfig {
  companyId: number;
  socials: BranchSocial[];
}
// #end-interface

// #component SocialsPage
const SocialsPage = () => {
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

  // #state [copiedConfig, setCopiedConfig] - Estado global con companyId
  const [copiedConfig, setCopiedConfig] = useState<CopiedSocialsConfig | null>(null);
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
            <h1 className={styles.title}>🌐 Redes Sociales</h1>
            <p className={styles.subtitle}>
              Configura las redes sociales de todas tus sucursales. Click en cada plataforma para editar.
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
              description="Crea tu primera compañía para comenzar a configurar redes sociales"
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
                  <BranchSocialsSection 
                    companyId={company.id} 
                    onError={setError}
                    copiedConfig={copiedConfig}
                    onCopyConfig={setCopiedConfig}
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

export default SocialsPage;
// #end-component

// #component BranchSocialsSection
/**
 * Componente interno que maneja la sección de redes sociales de sucursales.
 * Carga branches, socials y renderiza BranchAccordion expandibles.
 */
function BranchSocialsSection({ 
  companyId, 
  onError,
  copiedConfig,
  onCopyConfig
}: { 
  companyId: number; 
  onError: (error: string) => void;
  copiedConfig: CopiedSocialsConfig | null;
  onCopyConfig: (config: CopiedSocialsConfig | null) => void;
}) {
  // #hook useBranches
  const { 
    branches, 
    isLoading,
    loadBranches, 
    loadBranchSocials, 
    createSocial,
    updateSocial,
    deleteSocial,
    updateBranchSocials 
  } = useBranches(companyId);
  // #end-hook

  // #state [branchSocialsMap, setBranchSocialsMap]
  const [branchSocialsMap, setBranchSocialsMap] = useState<Map<number, BranchSocial[]>>(new Map());
  // #end-state

  // #state [isLoadingSocials, setIsLoadingSocials]
  const [isLoadingSocials, setIsLoadingSocials] = useState(false);
  // #end-state

  // #state [loadingBranchId, setLoadingBranchId]
  const [loadingBranchId, setLoadingBranchId] = useState<number | null>(null);
  // #end-state

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #effect - Load socials when branches are available
  useEffect(() => {
    if (branches.length > 0 && !isLoadingSocials) {
      const needsSocials = branches.some(branch => !branchSocialsMap.has(branch.id));
      
      if (needsSocials) {
        setIsLoadingSocials(true);
        
        Promise.all(
          branches.map(async (branch) => {
            if (!branchSocialsMap.has(branch.id)) {
              try {
                const socials = await loadBranchSocials(branch.id);
                setBranchSocialsMap(prev => new Map(prev).set(branch.id, socials));
                updateBranchSocials(branch.id, socials);
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
  }, [branches, loadBranchSocials, updateBranchSocials, isLoadingSocials, branchSocialsMap]);
  // #end-effect

  // #event handleUpdateSocials
  const handleUpdateSocials = async (branchId: number, socials: BranchSocial[]) => {
    setLoadingBranchId(branchId);
    onError('');

    try {
      // Actualizar en el mapa local
      setBranchSocialsMap(prev => new Map(prev).set(branchId, socials));
      updateBranchSocials(branchId, socials);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar redes sociales';
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
        {(isLoading || isLoadingSocials) && branches.length === 0 && (
          <p className={styles.loading}>Cargando redes sociales...</p>
        )}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && !isLoadingSocials && branches.length === 0 && (
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
                <SocialRow
                  branch={branch}
                  companyId={companyId}
                  socials={branchSocialsMap.get(branch.id) || []}
                  onUpdateSocials={handleUpdateSocials}
                  onCreateSocial={createSocial}
                  onUpdateSocial={updateSocial}
                  onDeleteSocial={deleteSocial}
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
  // #end-section
}
// #end-component
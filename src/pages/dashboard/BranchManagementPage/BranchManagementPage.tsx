// src/pages/dashboard/BranchManagementPage/BranchManagementPage.tsx

import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import { useCompanies } from '../../../hooks/useCompanies';
import { useSelectedSection } from './useSelectedSection';
import { BranchAccordionProvider } from '../../../hooks/BranchAccordion';
import BranchSchedulesSection from './sections/BranchSchedulesSection';
import BranchSocialsSection from './sections/BranchSocialsSection';
import BranchProductsSection from './sections/BranchProductsSection';
import BranchLocationSection from './sections/BranchLocationSection';
import type { BranchSchedule } from '../../../store/Branches.types';
import type { BranchSocial } from '../../../store/Branches.types';
import styles from './BranchManagementPage.module.css';

// #component BranchManagementPage
/**
 * Página unificada para gestión de sucursales.
 * Muestra compañías y sucursales con contenido dinámico según la sección seleccionada.
 * Las secciones disponibles son:
 * - schedules: Gestión de horarios
 * - socials: Gestión de redes sociales
 * - products: Gestión de productos y categorías
 */
const BranchManagementPage = () => {
  // #variable appLogoUrl
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  // #end-variable

  // #hook useCompanies
  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
    loadCompanies,
  } = useCompanies();
  // #end-hook

  // #hook useSelectedSection
  const { activeSection, sectionConfig } = useSelectedSection();
  // #end-hook

  // #state [globalError, setGlobalError]
  const [globalError, setGlobalError] = useState<string | null>(null);
  // #end-state

  // #state [copiedSchedulesConfig, setCopiedSchedulesConfig] - Para compartir config entre sucursales
  const [copiedSchedulesConfig, setCopiedSchedulesConfig] = useState<{
    companyId: number;
    schedules: BranchSchedule[];
  } | null>(null);
  // #end-state

  // #state [copiedSocialsConfig, setCopiedSocialsConfig]
  const [copiedSocialsConfig, setCopiedSocialsConfig] = useState<{
    companyId: number;
    socials: BranchSocial[];
  } | null>(null);
  // #end-state

  // #effect - Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-effect

  // #function getSectionComponent - Retorna el componente según la sección activa
  const getSectionComponent = (companyId: number) => {
    const commonProps = {
      companyId,
      onError: setGlobalError,
    };

    switch (activeSection) {
      case 'schedules':
        return (
          <BranchSchedulesSection
            {...commonProps}
            copiedConfig={copiedSchedulesConfig}
            onCopyConfig={setCopiedSchedulesConfig}
          />
        );
      case 'socials':
        return (
          <BranchSocialsSection
            {...commonProps}
            copiedConfig={copiedSocialsConfig}
            onCopyConfig={setCopiedSocialsConfig}
          />
        );
      case 'location':
        return <BranchLocationSection {...commonProps} />;
      case 'products':
        return <BranchProductsSection {...commonProps} />;
      default:
        return <BranchSchedulesSection {...commonProps} />;
    }
  };
  // #end-function

  // #section return
  return (
    <BranchAccordionProvider>
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
          {/* #section DashboardNavbar */}
          <DashboardNavbar />
          {/* #end-section */}

          {/* #section Main content */}
          <main className={styles.main}>
            {/* #section Dynamic header - Based on selected section */}
            <div className={styles.header}>
              <h1 className={styles.title}>{sectionConfig.title}</h1>
              <p className={styles.subtitle}>{sectionConfig.subtitle}</p>
            </div>
            {/* #end-section */}

            {/* #section Error handling */}
            {(globalError || companiesError) && (
              <div className={styles.error}>
                <p>❌ {globalError || companiesError}</p>
                <button onClick={() => setGlobalError(null)}>✕</button>
              </div>
            )}
            {/* #end-section */}

            {/* #section Loading state */}
            {isLoadingCompanies && (
              <div className={styles.loading}>Cargando compañías...</div>
            )}
            {/* #end-section */}

            {/* #section Empty state */}
            {!isLoadingCompanies && companies.length === 0 && (
              <EmptyState
                title="No hay compañías"
                description="Crea tu primera compañía para comenzar a gestionar tu negocio"
                actionButtonText="Ir a Compañías"
                onActionClick={() => (window.location.href = '/dashboard/companies')}
                icon="🏢"
              />
            )}
            {/* #end-section */}

            {/* #section Companies list with dynamic section content */}
            {companies.length > 0 && (
              <div className={styles.accordionList}>
                {companies.map((company) => (
                  <CompanyAccordion key={company.id} company={company}>
                    {getSectionComponent(company.id)}
                  </CompanyAccordion>
                ))}
              </div>
            )}
            {/* #end-section */}
          </main>
          {/* #end-section */}
        </div>
      </div>
    </BranchAccordionProvider>
  );
  // #end-section
};

export default BranchManagementPage;
// #end-component

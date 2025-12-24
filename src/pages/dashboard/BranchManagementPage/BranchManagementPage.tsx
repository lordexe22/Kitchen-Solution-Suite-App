// src/pages/dashboard/BranchManagementPage/BranchManagementPage.tsx

import { useEffect, useMemo, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import CompanyFormModal from '../../../components/CompanyFormModal/CompanyFormModal';
import { useCompanies } from '../../../hooks/useCompanies';
import type { Company, CompanyFormData } from '../../../store/Companies.types';
import { useSelectedSection } from './useSelectedSection';
import { BranchAccordionProvider } from '../../../hooks/BranchAccordion';
import BranchSchedulesSection from './sections/BranchSchedulesSection';
import BranchSocialsSection from './sections/BranchSocialsSection';
import BranchProductsSection from './sections/BranchProductsSection';
import BranchLocationSection from './sections/BranchLocationSection';
import BranchesEditSection from './sections/BranchesEditSection';
import type { BranchSchedule } from '../../../store/Branches.types';
import type { BranchSocial } from '../../../store/Branches.types';
import { useUserDataStore } from '../../../store/UserData.store';
import { useModulePermissions } from '../../../hooks/useModulePermissions';
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
    createCompany,
    updateCompany,
    deleteCompany,
    checkNameAvailability,
    uploadLogo,
  } = useCompanies();
  // #end-hook

  // #hook useSelectedSection
  const { activeSection, sectionConfig } = useSelectedSection();
  // #end-hook

  // #hook useUserDataStore - obtener datos del usuario logueado
  const userType = useUserDataStore((s) => s.type);
  const userBranchId = useUserDataStore((s) => s.branchId);
  const userCompanyId = useUserDataStore((s) => s.companyId);
  // #end-hook

  // #hook useModulePermissions - permisos por módulo (para secciones con control granular)
  const productsPerms = useModulePermissions('products');
  const schedulesPerms = useModulePermissions('schedules');
  const socialsPerms = useModulePermissions('socials');
  // #end-hook

  // #state [globalError, setGlobalError]
  const [globalError, setGlobalError] = useState<string | null>(null);
  // #end-state

  // #state company modal
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
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

  // #memo canViewSection - Determina si el usuario puede ver la sección activa
  const canViewSection = useMemo(() => {
    switch (activeSection) {
      case 'products':
        return productsPerms.canView;
      case 'schedules':
        return schedulesPerms.canView;
      case 'socials':
        return socialsPerms.canView;
      case 'location':
      case 'companies':
        // Solo admin/ownership pueden ver estas secciones
        return userType === 'admin' || userType === 'ownership';
      default:
        return false;
    }
  }, [activeSection, productsPerms.canView, schedulesPerms.canView, socialsPerms.canView, userType]);

  // #effect - Load companies solo si hay permiso de visualización
  useEffect(() => {
    if (canViewSection) {
      loadCompanies();
    }
  }, [loadCompanies, canViewSection]);
  // #end-effect

  // #function company modal handlers
  const handleOpenCreateCompanyModal = () => {
    setEditingCompany(undefined);
    setShowCompanyModal(true);
  };

  const handleOpenEditCompanyModal = (company: Company) => {
    setEditingCompany(company);
    setShowCompanyModal(true);
  };

  const handleCloseCompanyModal = () => {
    setShowCompanyModal(false);
    setEditingCompany(undefined);
  };

  const handleCompanySubmit = async (data: CompanyFormData) => {
    try {
      let savedCompany: Company;
      if (editingCompany) {
        await updateCompany(editingCompany.id, data);
        savedCompany = editingCompany;
      } else {
        savedCompany = await createCompany(data);
      }
      // Retorna la compañía guardada para que el modal pueda subir el logo
      return savedCompany;
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Error guardando compañía');
      throw err;
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (confirm('¿Estás seguro de eliminar esta compañía y todas sus sucursales?')) {
      try {
        await deleteCompany(companyId);
      } catch (err) {
        setGlobalError(err instanceof Error ? err.message : 'Error eliminando compañía');
      }
    }
  };
  // #end-function

  // #function getSectionComponent - Retorna el componente según la sección activa
  const getSectionComponent = (companyId: number) => {
    const commonProps = {
      companyId,
      onError: setGlobalError,
      filterByBranchId: userType === 'employee' ? userBranchId : undefined,
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
      case 'companies':
        return <BranchesEditSection {...commonProps} />;
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
              <div className={styles.headerContent}>
                <h1 className={styles.title}>{sectionConfig.title}</h1>
                <p className={styles.subtitle}>{sectionConfig.subtitle}</p>
              </div>
              {activeSection === 'companies' && (
                <div className={styles.headerActions}>
                  <button className="btn-pri btn-md" onClick={handleOpenCreateCompanyModal}>
                    + Nueva Compañía
                  </button>
                </div>
              )}
            </div>
            {/* #end-section */}

            {/* #section Access guard */}
            {!canViewSection && (
              <EmptyState
                title="Sin acceso"
                description="No tienes permisos para ver esta sección."
                icon="🔒"
              />
            )}
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
            {!isLoadingCompanies && companies.length === 0 && canViewSection && (
              <EmptyState
                title="No hay compañías"
                description="Crea tu primera compañía para comenzar a gestionar tu negocio"
                actionButtonText={activeSection === 'companies' ? 'Crear Compañía' : 'Ir a Compañías'}
                onActionClick={
                  activeSection === 'companies'
                    ? handleOpenCreateCompanyModal
                    : () => (window.location.href = '/dashboard/companies')
                }
                icon="🏢"
              />
            )}
            {/* #end-section */}

            {/* #section Companies list with dynamic section content */}
            {companies.length > 0 && canViewSection && (
              <div className={styles.accordionList}>
                {userType === 'employee' ? (
                  // #section Employee view - render solo su compañía sin accordion
                  userCompanyId && companies.find(c => c.id === userCompanyId) ? (
                    <div className={styles.employeeView}>
                      {getSectionComponent(userCompanyId)}
                    </div>
                  ) : (
                    <EmptyState
                      title="No se encontró tu compañía"
                      description="No tienes acceso a ninguna compañía"
                      icon="⚠️"
                    />
                  )
                  // #end-section
                ) : (
                  // #section Admin/Owner view - render todas las compañías con accordion
                  companies.map((company) => (
                    <CompanyAccordion
                      key={company.id}
                      company={company}
                      onEdit={() => handleOpenEditCompanyModal(company)}
                      onDelete={() => handleDeleteCompany(company.id)}
                    >
                      {getSectionComponent(company.id)}
                    </CompanyAccordion>
                  ))
                  // #end-section
                )}
              </div>
            )}
            {/* #end-section */}
          </main>
          {/* #end-section */}
        </div>
      </div>
      {/* #section CompanyFormModal */}
      {showCompanyModal && (
        <CompanyFormModal
          company={editingCompany}
          onClose={handleCloseCompanyModal}
          onSubmit={handleCompanySubmit}
          onUploadLogo={uploadLogo}
          onCheckNameAvailability={checkNameAvailability}
        />
      )}
      {/* #end-section */}
    </BranchAccordionProvider>
  );
  // #end-section
};

export default BranchManagementPage;
// #end-component

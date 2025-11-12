/* src/pages/dashboard/CompaniesPage/CompaniesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import CompanyFormModal from '../../../components/CompanyFormModal/CompanyFormModal';
import { useCompanies } from '../../../hooks/useCompanies';
import type { Company } from '../../../store/Companies.types';
import styles from './CompaniesPage.module.css';
import type { CompanyFormData } from '../../../store/Companies.types';
// #end-section

// #component CompaniesPage
const CompaniesPage = () => {
  // #variable appLogoUrl
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  // #end-variable
  // #hook useCompanies()
  const {
    companies,
    isLoading,
    error,
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    checkNameAvailability
  } = useCompanies();
  // #end-hook
  // #state [showModa, setShowModal]
  const [showModal, setShowModal] = useState(false);
  // #end-state
  // #state [editingCompany, setEditingCompany]
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  // #end-state
  // #state [expandedCompanyId, setExpandedCompanyId] 
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(null);
  // #end-state

  // #event -> loadCompanies
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-event

  // #function handleOpenCreateModal - open the modal with the form for create a new company
  const handleOpenCreateModal = () => {
    setEditingCompany(undefined);
    setShowModal(true);
  };
  // #end-function
  // #function handleOpenEditModal - handle when open modal for edit the company's name
  const handleOpenEditModal = (company: Company) => {
    setEditingCompany(company);
    setShowModal(true);
  };
  // #end-function
  // #function handleCloseModal - close modal window
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCompany(undefined);
  };
  // #end-function
  // #function handleSubmit - create or update company and then close de modal window
  const handleSubmit = async (data: CompanyFormData) => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, data);
    } else {
      await createCompany(data);
    }
    handleCloseModal();
  };
  // #end-function
  // #function handleDelete - delete company and its branches
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta compañía y todas sus sucursales?')) {
      await deleteCompany(id);
      // Si la compañía eliminada estaba expandida, colapsar
      if (expandedCompanyId === id) {
        setExpandedCompanyId(null);
      }
    }
  };
  // #end-function
  // #function handleToggleCompany - logic when expand an specific company
  const handleToggleCompany = (companyId: number) => {
    setExpandedCompanyId(expandedCompanyId === companyId ? null : companyId);
  };
  // #end-function
  // #section return
  return (
    <div className={styles.container}>
      {/* #section AppHeader - header for the page */}
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
          {/* #section - title */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mis Compañías</h1>
          </div>
          {/* #end-section */}
          {/* #section Error - show errors */}
          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button className="btn-sec btn-sm" onClick={loadCompanies}>
                Reintentar
              </button>
            </div>
          )}
          {/* #end-section */}
          {/* #section Loading - show loader while load companies list */}
          {isLoading && companies.length === 0 && (
            <div className={styles.loading}>Cargando compañías...</div>
          )}
          {/* #end-section */}
          {/* #section Empty State - show only if no companies created */}
          {!isLoading && companies.length === 0 && !error && (
            <EmptyState
              title="No hay compañías"
              description="Crea tu primera compañía para comenzar a gestionar tu negocio"
              actionButtonText="Crear Compañía"
              onActionClick={handleOpenCreateModal}
              icon="🏢"
            />
          )}
          {/* #end-section */}
          {/* #section Show Companies list - show only if no companies created */}
          {companies.length > 0 && (
            <div className={styles.accordionList}>
              {companies.map((company) => (
                <CompanyAccordion
                  key={company.id}
                  company={company}
                  isExpanded={expandedCompanyId === company.id}
                  onToggle={() => handleToggleCompany(company.id)}
                  onEdit={() => handleOpenEditModal(company)}
                  onDelete={() => handleDelete(company.id)}
                />
              ))}
            </div>
          )}
          {/* #end-section */}
        </main>
      </div>

      {/* #section CompanyFormModal - Modal window for create a new company */}
      {showModal && (
        <CompanyFormModal
          company={editingCompany}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onCheckNameAvailability={checkNameAvailability}
        />
      )}
      {/* #end-section */}
    </div>
  );
  // #end-section
};

export default CompaniesPage;
// #end-component
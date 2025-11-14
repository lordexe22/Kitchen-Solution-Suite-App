/* src/pages/dashboard/CompaniesPage/CompaniesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import BranchNameModal from '../../../components/BranchNameModal/BranchNameModal';
import CompanyFormModal from '../../../components/CompanyFormModal/CompanyFormModal';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import type { Company, CompanyFormData } from '../../../store/Companies.types';
import type { BranchWithLocation } from '../../../store/Branches.types';
import styles from './CompaniesPage.module.css';
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
  // #state [showModal, setShowModal]
  const [showModal, setShowModal] = useState(false);
  // #end-state
  // #state [editingCompany, setEditingCompany]
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  // #end-state
  // #event -> loadCompanies
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);
  // #end-event
  // #function handleOpenCreateModal
  const handleOpenCreateModal = () => {
    setEditingCompany(undefined);
    setShowModal(true);
  };
  // #end-function
  // #function handleOpenEditModal
  const handleOpenEditModal = (company: Company) => {
    setEditingCompany(company);
    setShowModal(true);
  };
  // #end-function
  // #function handleCloseModal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCompany(undefined);
  };
  // #end-function
  // #function handleSubmit
  const handleSubmit = async (data: CompanyFormData) => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, data);
    } else {
      await createCompany(data);
    }
    handleCloseModal();
  };
  // #end-function
  // #function handleDelete
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta compañía y todas sus sucursales?')) {
      await deleteCompany(id);
    }
  };
  // #end-function
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
          {/* #section Title */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mis Compañías</h1>
            <button 
              className="btn-pri btn-md" 
              onClick={handleOpenCreateModal}
            >
              + Nueva Compañía
            </button>
          </div>
          {/* #end-section */}

          {/* #section Error */}
          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button className="btn-sec btn-sm" onClick={loadCompanies}>
                Reintentar
              </button>
            </div>
          )}
          {/* #end-section */}

          {/* #section Loading */}
          {isLoading && companies.length === 0 && (
            <div className={styles.loading}>Cargando compañías...</div>
          )}
          {/* #end-section */}

          {/* #section Empty State */}
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

          {/* #section Companies List */}
          {companies.length > 0 && (
            <div className={styles.accordionList}>
              {companies.map((company) => (
                <CompanyAccordion
                  key={company.id}
                  company={company}
                  onEdit={() => handleOpenEditModal(company)}
                  onDelete={() => handleDelete(company.id)}
                >
                  <BranchesSection companyId={company.id} />
                </CompanyAccordion>
              ))}
            </div>
          )}
          {/* #end-section */}
        </main>
      </div>

      {/* #section CompanyFormModal */}
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
// #component BranchesSection
/**
 * Componente interno que maneja la sección de sucursales de una compañía.
 * Encapsula toda la lógica de CRUD de branches, modales y estados.
 */
function BranchesSection({ companyId }: { companyId: number }) {
  // #hook useBranches
  const {
    branches,
    isLoading,
    loadBranches,
    createBranch,
    updateBranchName,
    deleteBranch
  } = useBranches(companyId);
  // #end-hook
  // #state [showNameModal, setShowNameModal]
  const [showNameModal, setShowNameModal] = useState(false);
  // #end-state
  // #state [selectedBranch, setSelectedBranch]
  const [selectedBranch, setSelectedBranch] = useState<BranchWithLocation | null>(null);
  // #end-state
  // #event - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-event
  // #event handleCreateBranch
  const handleCreateBranch = async () => {
    try {
      await createBranch({ companyId });
    } catch (error) {
      console.error('Error creando sucursal:', error);
    }
  };
  // #end-event
  // #event handleEditName
  const handleEditName = (branch: BranchWithLocation) => {
    setSelectedBranch(branch);
    setShowNameModal(true);
  };
  // #end-event
  // #event handleDeleteBranch
  const handleDeleteBranch = async (branchId: number) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        await deleteBranch(branchId);
      } catch (error) {
        console.error('Error eliminando sucursal:', error);
      }
    }
  };
  // #end-event
  // #event handleSaveName
  const handleSaveName = async (name: string | null) => {
    if (!selectedBranch) return;
    try {
      await updateBranchName(selectedBranch.id, name);
      await loadBranches(true);
      setShowNameModal(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error guardando nombre:', error);
      throw error;
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
          <button
            className="btn-pri btn-sm"
            onClick={handleCreateBranch}
            disabled={isLoading}
          >
            + Nueva Sucursal
          </button>
        </div>
        {/* #end-section */}

        {/* #section Loading state */}
        {isLoading && branches.length === 0 && (
          <p className={styles.loading}>Cargando sucursales...</p>
        )}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && branches.length === 0 && (
          <p className={styles.emptyMessage}>
            No hay sucursales. Crea la primera para comenzar.
          </p>
        )}
        {/* #end-section */}

        {/* #section Branch list */}
        {!isLoading && branches.length > 0 && (
          <div className={styles.branchList}>
            {branches.map((branch, index) => (
              <BranchAccordion
                key={branch.id}
                branch={branch}
                displayIndex={index + 1}
                onEdit={() => handleEditName(branch)}
                onDelete={() => handleDeleteBranch(branch.id)}
              />
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>

      {/* #section Modal for edit branch name */}
      {showNameModal && selectedBranch && (
        <BranchNameModal
          branch={selectedBranch}
          onClose={() => {
            setShowNameModal(false);
            setSelectedBranch(null);
          }}
          onSave={handleSaveName}
        />
      )}
      {/* #end-section */}
    </>
  );
  // #end-section
}
// #end-component
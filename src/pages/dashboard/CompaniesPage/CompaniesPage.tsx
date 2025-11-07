/* src/pages/dashboard/CompaniesPage/CompaniesPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyCard from '../../../components/CompanyCard/CompanyCard';
import CompanyFormModal from '../../../components/CompanyFormModal/CompanyFormModal';
import { useCompanies } from '../../../hooks/useCompanies';
import type { Company } from '../../../store/Companies.types';
import styles from './CompaniesPage.module.css';
import type { CompanyFormData } from '../../../store/Companies.types';
// #end-section

// #component CompaniesPage
const CompaniesPage = () => {
  const appLogoUrl = `${import.meta.env.BASE_URL}page_icon.jpg`;
  
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

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);

  // Cargar compañías al montar el componente
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleOpenCreateModal = () => {
    setEditingCompany(undefined);
    setShowModal(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCompany(undefined);
  };

  const handleSubmit = async (data: CompanyFormData) => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, data);
    } else {
      await createCompany(data);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta compañía?')) {
      await deleteCompany(id);
    }
  };

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
          {/* Header con título y botón */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mis Compañías</h1>
            <button
              className="btn-pri btn-md"
              onClick={handleOpenCreateModal}
              disabled={isLoading}
            >
              + Crear Compañía
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button className="btn-sec btn-sm" onClick={loadCompanies}>
                Reintentar
              </button>
            </div>
          )}

          {/* Loading */}
          {isLoading && companies.length === 0 && (
            <div className={styles.loading}>Cargando compañías...</div>
          )}

          {/* Empty State */}
          {!isLoading && companies.length === 0 && !error && (
            <EmptyState
              title="No hay compañías"
              description="Crea tu primera compañía para comenzar a gestionar tu negocio"
              actionButtonText="Crear Compañía"
              onActionClick={handleOpenCreateModal}
              icon="🏢"
            />
          )}

          {/* Grid de compañías */}
          {companies.length > 0 && (
            <div className={styles.grid}>
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <CompanyFormModal
          company={editingCompany}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onCheckNameAvailability={checkNameAvailability}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
// #end-component
/* src/pages/dashboard/CompaniesPage/CompaniesPage.tsx */
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import CompanyFormModal from '../../../components/CompanyFormModal/CompanyFormModal';
import { useCompanies } from '../../../hooks/useCompanies';
import type { Company, CompanyFormData } from '../../../types/companies.types';
import styles from './CompaniesPage.module.css';

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
    checkNameAvailability,
    uploadLogo
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
      const result = await updateCompany(editingCompany.id, data);
      handleCloseModal();
      return result;
    } else {
      const result = await createCompany(data);
      handleCloseModal();
      return result;
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
        appName='Kitchen Solutions' 
        onLogin={() => {}}
        onLogout={() => {}}
      />
      <div className={styles.content}>
        <DashboardNavbar />
        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mis Compañías</h1>
            <button 
              className="btn-pri btn-md" 
              onClick={handleOpenCreateModal}
            >
              + Nueva Compañía
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
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                No hay compañías
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Crea tu primera compañía para comenzar a gestionar tu negocio
              </p>
              <button 
                className="btn-pri btn-md"
                onClick={handleOpenCreateModal}
              >
                Crear Compañía
              </button>
            </div>
          )}

          {/* Companies List */}
          {companies.length > 0 && (
            <div className={styles.accordionList}>
              {companies.map((company) => (
                <div key={company.id} className={styles.companyCard}>
                  <div className={styles.companyHeader}>
                    <div className={styles.companyInfo}>
                      {company.logoUrl && (
                        <img 
                          src={company.logoUrl} 
                          alt={company.name}
                          className={styles.companyLogo}
                        />
                      )}
                      <div className={styles.companyDetails}>
                        <h3 className={styles.companyName}>{company.name}</h3>
                        {company.description && (
                          <p className={styles.companyDescription}>{company.description}</p>
                        )}
                      </div>
                    </div>
                    <div className={styles.companyActions}>
                      <button 
                        className="btn-sec btn-sm"
                        onClick={() => handleOpenEditModal(company)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-ter btn-sm"
                        onClick={() => handleDelete(company.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
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
          onUploadLogo={uploadLogo}
          onCheckNameAvailability={checkNameAvailability}
        />
      )}
    </div>
  );
};

export default CompaniesPage;

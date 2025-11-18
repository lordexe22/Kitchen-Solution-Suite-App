/* src/pages/dashboard/ProductsPage/ProductsPage.tsx */
// #section imports
import { useEffect, useState } from 'react';
import AppHeader from '../../../components/AppHeader';
import DashboardNavbar from '../../../components/DashboardNavbar';
import EmptyState from '../../../components/EmptyState/EmptyState';
import CompanyAccordion from '../../../components/CompanyAccordion/CompanyAccordion';
import BranchAccordion from '../../../components/BranchAccordion/BranchAccordion';
import { useCompanies } from '../../../hooks/useCompanies';
import { useBranches } from '../../../hooks/useBranches';
import { CategoryCreatorModal } from '../../../modules/categoryCreator';
import type { CategoryConfiguration } from '../../../modules/categoryCreator';
import { generateBackgroundCSS } from '../../../modules/categoryCreator';
import styles from './ProductsPage.module.css';
// #end-section

// #component ProductsPage
/**
 * Página de gestión de productos y categorías.
 * Muestra compañías > sucursales > categorías.
 */
const ProductsPage = () => {
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
            <h1 className={styles.title}>🍽️ Productos y Categorías</h1>
            <p className={styles.subtitle}>
              Crea categorías para organizar tus productos por sucursal.
            </p>
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
          {isLoadingCompanies && companies.length === 0 && (
            <div className={styles.loading}>Cargando compañías...</div>
          )}
          {/* #end-section */}

          {/* #section Empty State */}
          {!isLoadingCompanies && companies.length === 0 && !error && (
            <EmptyState
              title="No hay compañías"
              description="Crea tu primera compañía en la sección de Compañías para comenzar"
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
                  onEdit={() => {}}
                  onDelete={() => {}}
                >
                  <BranchCategoriesSection 
                    companyId={company.id} 
                    onError={setError}
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

export default ProductsPage;
// #end-component

// #component BranchCategoriesSection
/**
 * Sección que muestra las sucursales de una compañía con sus categorías.
 */
function BranchCategoriesSection({ 
  companyId, 
  onError 
}: { 
  companyId: number; 
  onError: (error: string) => void;
}) {
  // #hook useBranches
  const { 
    branches, 
    isLoading,
    loadBranches
  } = useBranches(companyId);
  // #end-hook

  // #state [showCategoryModal, setShowCategoryModal]
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  // #end-state

  // #state [selectedBranchId, setSelectedBranchId]
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  // #end-state

  // #state [editingCategory, setEditingCategory]
  const [editingCategory, setEditingCategory] = useState<{ branchId: number; index: number; config: CategoryConfiguration } | null>(null);
  // #end-state

  // #state [categories, setCategories]
  const [categories, setCategories] = useState<Map<number, CategoryConfiguration[]>>(new Map());
  // #end-state

  // #effect - Load branches on mount
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);
  // #end-effect

  // #event handleOpenCreateModal
  /**
   * Abre modal para crear nueva categoría.
   */
  const handleOpenCreateModal = (branchId: number) => {
    setSelectedBranchId(branchId);
    setEditingCategory(null);
    setShowCategoryModal(true);
  };
  // #end-event

  // #event handleOpenEditModal
  /**
   * Abre modal para editar categoría existente.
   */
  const handleOpenEditModal = (branchId: number, categoryIndex: number) => {
    const branchCategories = categories.get(branchId) || [];
    const category = branchCategories[categoryIndex];
    if (category) {
      setSelectedBranchId(branchId);
      setEditingCategory({ branchId, index: categoryIndex, config: category });
      setShowCategoryModal(true);
    }
  };
  // #end-event

  // #event handleSaveCategory
  /**
   * Guarda categoría (crear o editar).
   */
  const handleSaveCategory = (config: CategoryConfiguration) => {
    const targetBranchId = editingCategory?.branchId || selectedBranchId;
    if (!targetBranchId) return;

    const branchCategories = categories.get(targetBranchId) || [];
    
    if (editingCategory) {
      // Editar existente
      const updatedCategories = [...branchCategories];
      updatedCategories[editingCategory.index] = config;
      setCategories(new Map(categories).set(targetBranchId, updatedCategories));
    } else {
      // Crear nueva
      const updatedCategories = [...branchCategories, config];
      setCategories(new Map(categories).set(targetBranchId, updatedCategories));
    }
    
    setShowCategoryModal(false);
    setSelectedBranchId(null);
    setEditingCategory(null);
  };
  // #end-event

  // #event handleDeleteCategory
  /**
   * Elimina una categoría.
   */
  const handleDeleteCategory = (branchId: number, categoryIndex: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    const branchCategories = categories.get(branchId) || [];
    const updatedCategories = branchCategories.filter((_, idx) => idx !== categoryIndex);
    
    setCategories(new Map(categories).set(branchId, updatedCategories));
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
        {isLoading && branches.length === 0 && (
          <p className={styles.loading}>Cargando sucursales...</p>
        )}
        {/* #end-section */}

        {/* #section Empty state */}
        {!isLoading && branches.length === 0 && (
          <p className={styles.emptyMessage}>
            No hay sucursales. Crea sucursales en la sección de Compañías.
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
                <div className={styles.categoriesContainer}>
                  {/* #section Botón crear categoría */}
                  <button
                    className="btn-pri btn-sm"
                    onClick={() => handleOpenCreateModal(branch.id)}
                  >
                    + Nueva Categoría
                  </button>
                  {/* #end-section */}

                  {/* #section Lista de categorías */}
                  {categories.get(branch.id) && categories.get(branch.id)!.length > 0 && (
                    <div className={styles.categoriesList}>
                      {categories.get(branch.id)!.map((category, catIndex) => (
                        <div
                          key={catIndex}
                          className={styles.categoryCard}
                          style={{
                            background: generateBackgroundCSS(category),
                            color: category.textColor
                          }}
                        >
                          <div className={styles.categoryContent}>
                            <div className={styles.categoryHeader}>
                              {category.icon && (
                                <span className={styles.categoryIcon}>
                                  {category.icon}
                                </span>
                              )}
                              <h5 className={styles.categoryName}>
                                {category.name}
                              </h5>
                            </div>
                            
                            {category.description && (
                              <p className={styles.categoryDescription}>
                                {category.description}
                              </p>
                            )}
                            
                            {category.imageUrl && (
                              <img 
                                src={category.imageUrl} 
                                alt={category.name}
                                className={styles.categoryImage}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          
                          <div className={styles.categoryActions}>
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleOpenEditModal(branch.id, catIndex)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleDeleteCategory(branch.id, catIndex)}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* #end-section */}
                </div>
              </BranchAccordion>
            ))}
          </div>
        )}
        {/* #end-section */}
      </div>

      {/* #section CategoryCreatorModal */}
      {showCategoryModal && (
        <CategoryCreatorModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedBranchId(null);
            setEditingCategory(null);
          }}
          onConfirm={handleSaveCategory}
          initialConfig={editingCategory?.config}
          title={editingCategory ? 'Editar Categoría' : 'Crear Categoría'}
          confirmText={editingCategory ? 'Guardar' : 'Crear'}
        />
      )}
      {/* #end-section */}
    </>
  );
  // #end-section
}
// #end-component
/* src\components\AddCompany\AddCompany.tsx */
// #section imports
import type { AddCompanyProps } from "../../modules/addCompany/addCompany.t";
import { useAddCompany } from "../../modules/addCompany/addCompany.hooks";
import styles from "./AddCompany.module.css";
// #end-section
// #component AddCompany - Component to add a new company
const AddCompany = ({ setCompanies }: AddCompanyProps) => {
  // #hook useAddCompany(setCompanies) - showModal, setShowModal, companyName, setCompanyName, companyAlias, setCompanyAlias, loading, error, handleCreate
  const {
    showModal,
    setShowModal,
    companyName,
    setCompanyName,
    companyAlias,
    setCompanyAlias,
    // logoFile, 
    setLogoFile,
    loading,
    error,
    handleCreate,
  } = useAddCompany(setCompanies)
  // #end-hook
  // #function renderCompanyNameInput - Return JSX for render the company name input
  /**
   * renderCompanyNameInput - Renders the input field for the company name.
   * 
   * This input:
   * - Automatically focuses when the modal opens.
   * - Is controlled by the `companyName` state.
   * - Updates the `companyName` state on value change.
   * - Has a placeholder with an example.
   * - Is disabled while the `loading` state is true.
   */
  const renderCompanyNameInput = () => (
    <input
      autoFocus
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      placeholder="Nombre del negocio (ej: McDonald's)"
      className={styles.inputField}
      disabled={loading}
    />
  );
  // #end-function
  // #function renderCompanyAliasInput - Return JSX for render the company alias input
  /**
   * renderCompanyAliasInput - Renders the input field for the company alias or label.
   * 
   * This input:
   * - Is controlled by the `companyAlias` state.
   * - Updates the `companyAlias` state on value change.
   * - Has a placeholder indicating it is optional.
   * - Is disabled while the `loading` state is true.
   */
  const renderCompanyAliasInput = () => (
    <input
      value={companyAlias}
      onChange={(e) => setCompanyAlias(e.target.value)}
      placeholder="Alias / etiqueta (opcional)"
      className={styles.inputField}
      disabled={loading}
    />
  );
  // #end-function
  // #function renderCompanyLogoInput - Return JSX for render the company logo input
  /**
   * renderCompanyLogoInput - Renders the file input for the company logo.
   * 
   * This input:
   * - Only accepts image files.
   * - Updates the `logoFile` state on file selection.
   * - Is disabled while the `loading` state is true.
   */
  const renderCompanyLogoInput = () => (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setLogoFile(file); // estado que deberás definir en el hook
      }}
      className={styles.inputField}
      disabled={loading}
    />
  );
  // #end-function
  // #function renderError - Return JSX for render error message
  /**
   * renderError - Renders the error message inside the modal, if any.
   * 
   * Displays the error text from the `error` variable.
   * Only renders if `error` is not null or empty.
   */
  const renderError = () =>
    error && <div className={styles.errorMessage}>{error}</div>;
  // #end-function
  // #function renderModalButtons - Return JSX for render the modal buttons for create and cancel operations
  /**
   * renderModalButtons - Renders the modal action buttons for canceling or creating the company.
   * 
   * "Cancel" button:
   * - Closes the modal when clicked (`setShowModal(false)`).
   * - Is disabled while `loading` is true.
   * 
   * "Create" button:
   * - Executes the `handleCreate` function to create the company.
   * - Is disabled while loading or if the company name is empty (after trimming).
   * - Shows "Creating..." text during loading, otherwise shows "Create".
   */
  const renderModalButtons = () => (
    <div className={styles.buttonsContainer}>
      <button onClick={() => setShowModal(false)} disabled={loading}>
        Cancelar
      </button>
      <button onClick={handleCreate} disabled={loading || !companyName.trim()}>
        {loading ? "Creando..." : "Crear"}
      </button>
    </div>
  );
  // #end-function
  // #section return
  return (
    <>
      {/* #section - Button for add a new company */}
      <button onClick={() => setShowModal(true)}>Agregar Negocio</button>
      {/* #end-section */}
      {/* #section - Show inputs options for add the new company */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2>Agregar nuevo negocio</h2>
            {renderCompanyNameInput()}
            {renderCompanyAliasInput()}
            {renderCompanyLogoInput()}
            {renderError()}
            {renderModalButtons()}
          </div>
        </div>
      )}
      {/* #end-section */}
    </>
  );
  // #end-section
};
export default AddCompany;
// #end-component

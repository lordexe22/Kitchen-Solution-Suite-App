/* src\components\AddCompany\AddCompany.tsx */
// #section imports
import { useState } from "react";
import styles from "./AddCompany.module.css";
import { fetchUserCompanyArray } from "../../modules/company/company.utils";
import { type CompanyBaseDataType } from "../../modules/company/company.t";
import { fetchWithJWT } from "../../utils/fetch";
import { decodeJWTPayload } from "../../utils/jwt";
// #end-section

type Props = {
  setBusinesses: (b: CompanyBaseDataType[]) => void;
};

// #function AddCompany - Component to add a new company
const AddCompany = ({ setBusinesses }: Props) => {
  // #variable - showModal, businessName, businessAlias, loading, error
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyAlias, setCompanyAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #end-variable
  // #function handleCreate - Handles the creation of a new business
  const handleCreate = async () => {
    // #step 1 - Validate companies name and alias >> trimmedName, trimmedAlias
    const trimmedName = companyName.trim();
    const trimmedAlias = companyAlias.trim() || undefined;
    if (!trimmedName) return;
    // #end-step
    // #step 2 - Prepare loading state and reset error before making the request
    setLoading(true);
    setError(null);
    // #end-step
    try {
      // #step 3 - Get the JWT token from localStorage and decode it to get the user ID from the payload
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");
      const payload = decodeJWTPayload(token);
      const userId = payload?.id;
      if (!userId) throw new Error("ID de usuario no encontrado en el token");
      // #end-step
      // #step 4 - Make the request to create the companies, passing the name, alias, and user ID
      await fetchWithJWT(
        "http://localhost:4000/api/companies/create",
        "POST",
        {
          name: trimmedName,
          alias: trimmedAlias,
          userId,
        }
      );
      // #end-step
      // #step 5 - Fetch the updated list of companies and update the state
      const updated = await fetchUserCompanyArray(token);
      setBusinesses(updated);
      // #end-step
      // #step 6 - Reset the input fields and close the modal
      setCompanyName("");
      setCompanyAlias("");
      setShowModal(false);
      // #end-step
    } catch (e: unknown) {
      // #step 7 - Handle errors and set the error message
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al crear el negocio");
      }
      // #end-step
    } finally {
      // #step 8 - Reset loading state
      setLoading(false);
      // #end-step
    }
  };
  // #end-function
  // #section return
  return (
    <>
      {/* #section - Button to open modal */}
      <button onClick={() => setShowModal(true)}>Agregar Negocio</button>
      {/* #end-section */}
      {/* #section - Modal */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            {/* #section - Modal header */}
            <h2>Agregar nuevo negocio</h2>
            {/* #end-section */}
            {/* #section - Input field for company name */}
            <input
              autoFocus
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nombre del negocio (ej: McDonald's)"
              className={styles.inputField}
              disabled={loading}
            />
            {/* #end-section */}
            {/* #section - Input field for company alias */}
            <input
              value={companyAlias}
              onChange={(e) => setCompanyAlias(e.target.value)}
              placeholder="Alias / etiqueta (opcional)"
              className={styles.inputField}
              disabled={loading}
            />
            {/* #end-section */}
            {/* #section - Error message if any */}
            {error && <div className={styles.errorMessage}>{error}</div>}
            {/* #end-section */}
            {/* #section - Buttons for cancel and create */}
            <div className={styles.buttonsContainer}>
              <button onClick={() => setShowModal(false)} disabled={loading}>
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={loading || !companyName.trim()}>
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
            {/* #end-section */}
          </div>
        </div>
      )}
      {/* #end-section */}
    </>
  );
  // #end-section
};
export default AddCompany;
// #end-function

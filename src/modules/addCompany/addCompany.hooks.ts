/* src\modules\addCompany\addCompany.hooks.ts */
// #section imports
import type { CompanyBaseDataType } from "../company/company.t";
import { useState } from "react";
import { fetchUserCompanyArray } from "../company/company.utils";
import { fetchWithJWT } from "../../utils/fetch";
import { decodeJWTPayload } from "../../utils/jwt";
import { API_FETCH_ACTIONS } from "../company/company.config";
import { uploadImageAndGetURL } from "./addCompany.utils";
// #end-section
// #hook useAddCompany - Hook to manage adding a new company
export const useAddCompany = (setCompanies: (b: CompanyBaseDataType[]) => void) => {
  // #state [showModal, setShowModal] - Boolean that controls the visibility of the "Add Company" modal window
  const [showModal, setShowModal] = useState(false);
  // #end-state
  // #state [companyName, setCompanyName] - Text input value for the new company's name, required for creation
  const [companyName, setCompanyName] = useState("");
  // #end-state
  // #state [companyAlias, setCompanyAlias] - Text input value for the new company's alias, optional label
  const [companyAlias, setCompanyAlias] = useState("");
  // #end-state
  // #state [logoFile, setLogoFile] - Holds the selected logo file for the new company
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // #end-state
  // #state [loading, setLoading] - Boolean that indicates whether the company creation request is in progress
  const [loading, setLoading] = useState(false);
  // #end-state
  // #state [error, setError] - Holds the error message to display inside the modal if company creation fails
  const [error, setError] = useState<string | null>(null);
  // #end-state
  // #event handleCreate - Handles the creation of a new business
  /**
   * handleCreate - Handles the creation of a new company.
   * 
   * Workflow:
   * 1. Trims and validates the company name and alias inputs; stops if name is empty.
   * 2. Sets loading state and clears any previous error.
   * 3. Retrieves the JWT token from localStorage and decodes it to extract the user ID.
   * 4. Sends a POST request to the backend API to create a new company with the name, alias, and user ID.
   * 5. Fetches the updated list of user companies using the token and updates the parent state via setCompanies.
   * 6. Resets input fields and closes the modal on successful creation.
   * 7. Catches and sets error messages if any step fails.
   * 8. Finally, resets the loading state regardless of success or failure.
   */
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
      if (!token) throw new Error("Token not found");
      const payload = decodeJWTPayload(token);
      const userId = payload?.id;
      if (!userId) throw new Error("User ID not found in token");
      // #end-step
      // #step 4 - Try to create the url for the image logo
      let logoUrl: string | undefined;
      if (logoFile) {
        try {
          logoUrl = await uploadImageAndGetURL(logoFile);
        } catch (uploadError: unknown) {
          throw new Error(`Error al subir el logo. Inténtalo nuevamente. Error: ${uploadError}`);
        }
      }
      // #end-step
      // #step 5 - Make the request to create the company
      await fetchWithJWT(
        API_FETCH_ACTIONS.createCompany.url,
        API_FETCH_ACTIONS.createCompany.method,
        {
          name: trimmedName,
          alias: trimmedAlias,
          userId,
          logo_url: logoUrl
        }
      );
      // #end-step
      // #step 6 - Fetch the updated list of companies and update the state
      const updated = await fetchUserCompanyArray(token);
      setCompanies(updated);
      // #end-step
      // #step 7 - Reset the input fields and close the modal
      setCompanyName("");
      setCompanyAlias("");
      setShowModal(false);
      // #end-step
      } catch (e: unknown) {
      // #step 8 - Handle errors and set the error message
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al crear el negocio");
      }
      // #end-step
    } finally {
      // #step 9 - Reset loading state
      setLoading(false);
      // #end-step
    }
  };
  // #end-event
  // #section return
  return {
    showModal,
    setShowModal,
    companyName,
    setCompanyName,
    companyAlias,
    setCompanyAlias,
    logoFile,
    setLogoFile,
    loading,
    error,
    handleCreate,
  };
  // #end-section
};
// #end-hook
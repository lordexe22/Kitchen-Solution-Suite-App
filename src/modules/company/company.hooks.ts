/* src\modules\company\company.hooks.ts */
// #section Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserCompanyArray } from "./company.utils";
import { type CompanyBaseDataType } from "./company.t";
// #end-section
// #hook useLoadUserCompanies - Hook to fetch user's businesses
/**
 * Hook that loads the businesses associated with the authenticated user.
 *
 * It retrieves the JWT token from local storage, fetches the business array,
 * and handles loading and error states. If the token is not found or the request fails,
 * the user is redirected to the login page.
 * 
 * @param {React.Dispatch<React.SetStateAction<CompanyBaseDataType[]>>} [setCompaniesExternal] Optional setter to mirror the company list externally
 * @returns {object} An object with:
 * - businesses: CompanyBaseDataType[] — The list of fetched businesses.
 * - error: Error | null — Any error occurred during the request.
 * - isLoading: boolean — Indicates whether the request is in progress.
 */
export const useLoadUserCompanies = (
  setCompaniesExternal?: React.Dispatch<React.SetStateAction<CompanyBaseDataType[]>>
) => {
  // #state [companies, setCompanies] - Stores the fetched list of businesses
  const [companies, setCompanies] = useState<CompanyBaseDataType[]>([]);
  // #end-state
  // #state [error, setError] - Captures any error during the request
  const [error, setError] = useState<Error | null>(null);
  // #end-state
  // #state [isLoading, setIsLoading] - Indicates whether the request is currently running
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // #end-state
  // #hook navigate = useNavigate() - 
  const navigate = useNavigate();
  // #end-hook

  // #event useEffect [navigate, setExternal] - Loads the user's businesses on component mount
  useEffect(() => {
    const loadUserCompanyArray = async () => {
      try {
        // #step 1 - Try to get JWT from localStorage 
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Token no encontrado");
        // #end-step
        // #step 2 - Fetch company data using the JWT >> data
        const data = await fetchUserCompanyArray(token);
        // #end-step
        // #step 3 - Update internal and optional external state
        setCompanies(data);
        if (setCompaniesExternal) setCompaniesExternal(data);
        // #end-step
      } catch (err) {
        // #step 4 - Set error and redirect to login 
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        navigate("/login");
        // #end-step
      } finally {
        // #step 5 - Mark loading as complete
        setIsLoading(false);
        // #end-step
      }
    };
    loadUserCompanyArray();
  }, [navigate, setCompaniesExternal]);
  // #end-event

  // #section return
  return { 
    companies, 
    error, 
    isLoading 
  };
  // #end-section
};
// #end-hook
// #hook useCompanyAccordion - Hook para manejar el estado del acordeón de empresas
/**
 * Hook that manages the accordion state for companies and their internal sections.
 *
 * It allows toggling which company is expanded, and within that company,
 * which section (e.g., "Social Media", "Location") is currently visible.
 *
 * Clicking the same company or section again collapses it.
 * Selecting a different company resets the expanded section.
 *
 * @returns {object} An object containing the state and actions to control the accordion:
 * - expandedCompanyId: string | null — ID of the currently expanded company.
 * - expandedSection: string | null — Name of the currently expanded section within the company.
 * - toggleCompany(id: string): void — Toggles the expansion of a company.
 * - toggleSection(section: string): void — Toggles the expansion of a section inside the selected company.
 */
export const useCompanyAccordion = () : {
  expandedCompanyId: string | null;
  expandedSection: string | null;
  toggleCompany: (id: string) => void;
  toggleSection: (section: string) => void;
} => {
  // #state [expandedCompanyId, setExpandedCompanyId] - The ID of the currently expanded company, null means no company was expanded
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  // #end-state
  // #state [expandedSection, setExpandedSection] - The key/name of the currently expanded section inside the expanded company. Null means no section is expanded.
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // #end-state
  // #function toggleCompany - Toggles the expansion state of a company
  /**
   * Toggles the expansion state of a company.
   * If the given company ID is already expanded, it collapses it.
   * Otherwise, expands the new company and resets the expanded section.
   *
   * @param {string} companyId - Company ID for toggle
   */
  const toggleCompany = (companyId: string) => {
    // #step 1 - If the given company ID is already expanded, it collapses it. Otherwise, expands the new company and resets the expanded section.
    setExpandedCompanyId((prevId) => (prevId === companyId ? null : companyId));
    // #end-step
    // #step 2 - Close all the expanded sections
    setExpandedSection(null);
    // #end-step
  };
  // #end-function
  // #function toggleSection - oggles the expansion state of a section inside the currently expanded company.
  /**
   * Toggles the expansion state of a section inside the currently expanded company.
   * If the section is already expanded, it collapses it.
   * Otherwise, expands the new section.
   *
   * @param {string} sectionId - Section ID for toggle.
   */
  const toggleSection = (sectionId: string) => {
    // #step 1 - If the section is already expanded, it collapses it. Otherwise, expands the new section.
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
    // #end-step
  };
  // #end-function
  // #section return
  return {
    expandedCompanyId,
    expandedSection,
    toggleCompany,
    toggleSection,
  };
  // #end-section
};
// #end-hook


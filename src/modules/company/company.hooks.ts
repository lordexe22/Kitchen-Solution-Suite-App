// src/modules/company/hooks/useLoadUserCompanies.ts
// #section Importaciones
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserCompanyArray } from "./company.utils";
import { type CompanyBaseDataType } from "./company.t";
// #end-section
// #function useLoadUserCompanies - Hook para obtener negocios del usuario
/**
 * Hook que carga los negocios del usuario autenticado.
 * Si no se encuentra el token o falla la carga, redirige al login.
 * Devuelve negocios, error y estado de carga.
 */
export const useLoadUserCompanies = (
  setExternal?: React.Dispatch<React.SetStateAction<CompanyBaseDataType[]>>
) => {
  // #variable companyArray, error, isLoading, navigate - Estado interno y navegación
  const [companyArray, setCompanyArray] = useState<CompanyBaseDataType[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // #end-variable

  // #event useEffect - Captura todos los negocios del usuario al montar el componente

  useEffect(() => {
    const loadUserCompanyArray = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Token no encontrado");
        const data = await fetchUserCompanyArray(token);
        setCompanyArray(data);
        if (setExternal) setExternal(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCompanyArray();
  }, [navigate, setExternal]);
  // #end-event

  return { businesses: companyArray, error, isLoading };
};
// #end-function
// #function useCompanyAccordion - Hook para manejar el estado del acordeón de empresas
/**
 * Hook que gestiona el comportamiento de un acordeón de empresas y sus secciones internas.
 *
 * Permite alternar qué empresa está expandida, y dentro de esa empresa,
 * qué sección (como "Redes sociales", "Dirección", etc.) está actualmente visible.
 *
 * Si se vuelve a hacer clic sobre la misma empresa o sección, estas se colapsan.
 * Cuando se selecciona una empresa distinta, la sección expandida se resetea.
 *
 * @returns {object} Objeto con estado y acciones para controlar el acordeón:
 * - expandedCompanyId: string | null → ID de la empresa actualmente expandida.
 * - expandedSection: string | null → Nombre de la sección actualmente expandida dentro de la empresa.
 * - toggleCompany(id): Alterna la expansión de una empresa. Si es otra empresa, colapsa la anterior y resetea la sección.
 * - toggleSection(section): Alterna la expansión de una sección dentro de la empresa seleccionada.
 */
export const useCompanyAccordion = () => {
  // #variable expandedCompanyId, expandedSection
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // #end-variable
  // #function toggleCompany - Alterna la expansión de una empresa
    /**
   * Alterna la expansión de una empresa.
   * Si la empresa está expandida, la colapsa; si no, la expande.
   * Resetea la sección expandida a null.
   *
   * @param {string} id - Id de la empresa a alternar.
   */
  const toggleCompany = (id: string) => {
    setExpandedCompanyId((prevId) => (prevId === id ? null : id));
    setExpandedSection(null);
  };
  // #end-function
  // #function toggleSection - Alterna la expansión de una sección
    /**
   * Alterna la expansión de una sección dentro de la empresa expandida.
   * Si la sección está expandida, la colapsa; si no, la expande.
   *
   * @param {string} section - Nombre de la sección a alternar.
   */
  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
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
// #end-function






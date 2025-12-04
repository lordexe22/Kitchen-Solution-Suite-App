/* src/hooks/useCompanies.ts */
// #section imports
import { useCallback } from 'react';
import { useCompaniesStore } from '../store/Companies.store';
import {
  fetchUserCompanies,
  createCompany as createCompanyService,
  updateCompany as updateCompanyService,
  deleteCompany as deleteCompanyService
} from '../services/companies/companies.service';
import type { CompanyFormData } from '../store/Companies.types';
import { uploadCompanyLogo } from '../services/companies/companiyLogo.service';
import { useAsyncOperation } from './useAsyncOperation';
// #end-section
// #hook useCompanies
/**
 * Hook personalizado para gestionar compañías.
 * Orquesta el store (estado) y el service (HTTP).
 * 
 * @returns {object} Estado y funciones para gestionar compañías
 * 
 * @example
 * const { companies, isLoading, error, loadCompanies, createCompany } = useCompanies();
 */
export const useCompanies = () => {
  // Estado del store
  const {
    companies,
    setCompanies,
    addCompany,
    updateCompany: updateCompanyInStore,
    removeCompany
  } = useCompaniesStore();

  // Hook para operaciones asíncronas
  const { isLoading, error, execute } = useAsyncOperation();

  // #function loadCompanies
  /**
   * Carga todas las compañías del usuario desde el backend.
   */
  const loadCompanies = useCallback(async () => {
    const result = await execute(
      async () => await fetchUserCompanies(),
      'Error al cargar compañías'
    );
    if (result) {
      setCompanies(result);
    }
  }, [execute, setCompanies]);
  // #end-function

  // #function createCompany
  /**
   * Crea una nueva compañía.
   * 
   * @param {CompanyFormData} data - Datos de la compañía
   */
  const createCompany = useCallback(async (data: CompanyFormData) => {
    const result = await execute(
      async () => await createCompanyService(data),
      'Error al crear compañía'
    );
    if (result) {
      addCompany(result);
      return result;
    }
    throw new Error('Failed to create company');
  }, [execute, addCompany]);
  // #end-function

  // #function updateCompany
  /**
   * Actualiza una compañía existente.
   * 
   * @param {number} id - ID de la compañía
   * @param {Partial<CompanyFormData>} updates - Datos a actualizar
   */
  const updateCompany = useCallback(async (id: number, updates: Partial<CompanyFormData>) => {
    const result = await execute(
      async () => await updateCompanyService(id, updates),
      'Error al actualizar compañía'
    );
    if (result) {
      updateCompanyInStore(id, result);
      return result;
    }
    throw new Error('Failed to update company');
  }, [execute, updateCompanyInStore]);
  // #end-function

  // #function deleteCompany
  /**
   * Elimina (soft delete) una compañía.
   * 
   * @param {number} id - ID de la compañía
   */
  const deleteCompany = useCallback(async (id: number) => {
    const result = await execute(
      async () => await deleteCompanyService(id),
      'Error al eliminar compañía'
    );
    if (result !== null) {
      removeCompany(id);
    }
  }, [execute, removeCompany]);
  // #end-function

  // #function uploadLogo
  /**
   * Sube el logo de una compañía.
   * 
   * @param companyId - ID de la compañía
   * @param file - Archivo de imagen
   */
  const uploadLogo = useCallback(async (companyId: number, file: File) => {
    const result = await execute(
      async () => await uploadCompanyLogo(companyId, file),
      'Error al subir logo'
    );
    if (result) {
      updateCompanyInStore(companyId, result);
      return result;
    }
    throw new Error('Failed to upload logo');
  }, [execute, updateCompanyInStore]);
  // #end-function

  return {
    companies,
    isLoading,
    error,
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    uploadLogo
  };
};
// #end-hook
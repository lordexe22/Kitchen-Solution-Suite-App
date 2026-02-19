/* src/hooks/useCompanies.ts */
import { useCallback, useState } from 'react';
import { useCompaniesStore } from '../store/Companies.store';
import type { CompanyFormData, Company } from '../types/companies.types';
import * as companiesService from '../services/companies/companies.service';

/**
 * Hook personalizado para gestionar compañías.
 * Orquesta el store (estado local) y el service (HTTP al backend).
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

  // Estados locales para operaciones asíncronas
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todas las compañías del usuario desde el backend.
   * Requiere JWT válido en cookie.
   */
  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesService.getAllCompanies({ state: 'active' });
      setCompanies(response.companies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar compañías';
      setError(errorMessage);
      console.error('Error loading companies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setCompanies]);

  /**
   * Crea una nueva compañía en el backend.
   * Requiere JWT válido en cookie.
   * 
   * @param {CompanyFormData} data - Datos de la compañía
   * @param {Function} setFormError - Callback para mostrar error en el formulario
   */
  const createCompany = useCallback(async (
    data: CompanyFormData,
    setFormError?: (error: string) => void
  ): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesService.createCompany(data);
      addCompany(response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear compañía';
      setError(errorMessage);
      console.error('Error creating company:', err);
      
      // Si es error de nombre duplicado, notificar al formulario
      if (errorMessage.includes('already taken') || errorMessage.includes('ya está en uso')) {
        setFormError?.(errorMessage);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addCompany]);

  /**
   * Actualiza una compañía existente en el backend.
   * Requiere JWT válido en cookie y permisos de propietario.
   * 
   * @param {number} id - ID de la compañía
   * @param {Partial<CompanyFormData>} updates - Datos a actualizar
   * @param {Function} setFormError - Callback para mostrar error en el formulario
   */
  const updateCompany = useCallback(async (
    id: number,
    updates: Partial<CompanyFormData>,
    setFormError?: (error: string) => void
  ): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesService.updateCompany(id, updates);
      updateCompanyInStore(id, response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar compañía';
      setError(errorMessage);
      console.error('Error updating company:', err);
      
      // Si es error de nombre duplicado, notificar al formulario
      if (errorMessage.includes('already taken') || errorMessage.includes('ya está en uso')) {
        setFormError?.(errorMessage);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateCompanyInStore]);

  /**
   * Elimina permanentemente una compañía del backend.
   * Requiere JWT válido en cookie y permisos de propietario.
   * 
   * @param {number} id - ID de la compañía
   */
  const deleteCompany = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await companiesService.deleteCompany(id);
      removeCompany(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar compañía';
      setError(errorMessage);
      console.error('Error deleting company:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [removeCompany]);

  /**
   * Archiva una compañía en el backend.
   * Requiere JWT válido en cookie y permisos de propietario.
   * 
   * @param {number} id - ID de la compañía
   */
  const archiveCompany = useCallback(async (id: number): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesService.archiveCompany(id);
      updateCompanyInStore(id, response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al archivar compañía';
      setError(errorMessage);
      console.error('Error archiving company:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [updateCompanyInStore]);

  /**
   * Reactiva una compañía archivada en el backend.
   * Requiere JWT válido en cookie y permisos de propietario.
   * 
   * @param {number} id - ID de la compañía
   */
  const reactivateCompany = useCallback(async (id: number): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await companiesService.reactivateCompany(id);
      updateCompanyInStore(id, response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reactivar compañía';
      setError(errorMessage);
      console.error('Error reactivating company:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [updateCompanyInStore]);

  /**
   * Verifica si un nombre de compañía está disponible.
   * Útil para validación en tiempo real en formularios.
   * 
   * @param {string} name - Nombre a verificar
   */
  const checkNameAvailability = useCallback(async (name: string): Promise<boolean> => {
    try {
      const response = await companiesService.checkNameAvailability(name);
      return response.available;
    } catch (err) {
      console.error('Error checking name availability:', err);
      return false;
    }
  }, []);

  /**
   * Sube o reemplaza el logo de una compañía.
   * Envía el archivo como multipart/form-data y actualiza el store.
   *
   * @param {number} companyId - ID de la compañía
   * @param {File} file - Archivo de imagen a subir
   */
  const uploadLogo = useCallback(async (companyId: number, file: File): Promise<Company> => {
    try {
      const response = await companiesService.uploadCompanyLogo(companyId, file);
      updateCompanyInStore(companyId, response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir logo';
      console.error('Error uploading logo:', err);
      throw new Error(errorMessage);
    }
  }, [updateCompanyInStore]);

  /**
   * Elimina el logo de una compañía.
   * Llama al backend y actualiza el store.
   *
   * @param {number} companyId - ID de la compañía
   */
  const deleteLogo = useCallback(async (companyId: number): Promise<Company> => {
    try {
      const response = await companiesService.deleteCompanyLogo(companyId);
      updateCompanyInStore(companyId, response.company);
      return response.company;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar logo';
      console.error('Error deleting logo:', err);
      throw new Error(errorMessage);
    }
  }, [updateCompanyInStore]);

  return {
    companies,
    isLoading,
    error,
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    archiveCompany,
    reactivateCompany,
    checkNameAvailability,
    uploadLogo,
    deleteLogo
  };
};

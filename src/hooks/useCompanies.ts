/* src/hooks/useCompanies.ts */
// #section imports
import { useState, useCallback } from 'react';
import { useCompaniesStore } from '../store/Companies.store';
import {
  fetchUserCompanies,
  createCompany as createCompanyService,
  updateCompany as updateCompanyService,
  deleteCompany as deleteCompanyService,
  checkCompanyNameAvailability as checkNameService
} from '../services/companies/companies.service';
import type { CompanyFormData } from '../store/Companies.types';
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
    removeCompany,
    clearCompanies
  } = useCompaniesStore();

  // Estado local para loading y errores
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // #function loadCompanies
  /**
   * Carga todas las compañías del usuario desde el backend.
   */
  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const companies = await fetchUserCompanies();
      setCompanies(companies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar compañías';
      setError(errorMessage);
      console.error('Error loading companies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setCompanies]);
  // #end-function

  // #function createCompany
  /**
   * Crea una nueva compañía.
   * 
   * @param {CompanyFormData} data - Datos de la compañía
   */
  const createCompany = useCallback(async (data: CompanyFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCompany = await createCompanyService(data);
      addCompany(newCompany);
      return newCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear compañía';
      setError(errorMessage);
      console.error('Error creating company:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addCompany]);
  // #end-function

  // #function updateCompany
  /**
   * Actualiza una compañía existente.
   * 
   * @param {number} id - ID de la compañía
   * @param {Partial<CompanyFormData>} updates - Datos a actualizar
   */
  const updateCompany = useCallback(async (id: number, updates: Partial<CompanyFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCompany = await updateCompanyService(id, updates);
      updateCompanyInStore(id, updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar compañía';
      setError(errorMessage);
      console.error('Error updating company:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateCompanyInStore]);
  // #end-function

  // #function deleteCompany
  /**
   * Elimina (soft delete) una compañía.
   * 
   * @param {number} id - ID de la compañía
   */
  const deleteCompany = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCompanyService(id);
      removeCompany(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar compañía';
      setError(errorMessage);
      console.error('Error deleting company:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [removeCompany]);
  // #end-function

  // #function checkNameAvailability
  /**
   * Verifica si un nombre de compañía está disponible.
   * 
   * @param {string} name - Nombre a verificar
   * @returns {Promise<boolean>} true si está disponible
   */
  const checkNameAvailability = useCallback(async (name: string): Promise<boolean> => {
    try {
      return await checkNameService(name);
    } catch (err) {
      console.error('Error checking name availability:', err);
      return false;
    }
  }, []);
  // #end-function

  return {
    // Estado
    companies,
    isLoading,
    error,
    
    // Funciones
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    checkNameAvailability,
    clearCompanies
  };
};
// #end-hook
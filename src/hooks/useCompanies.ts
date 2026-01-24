/* src/hooks/useCompanies.ts */
import { useCallback, useState } from 'react';
import { useCompaniesStore } from '../store/Companies.store';
import type { CompanyFormData, Company } from '../types/companies.types';

/**
 * Hook personalizado para gestionar compañías.
 * Orquesta el store (estado) y el service (HTTP).
 * 
 * NOTA: Por ahora NO incluye servicios HTTP, solo maneja estado local.
 * En el futuro se conectará al backend.
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
   * TODO: Conectar con el servicio HTTP real
   */
  const loadCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const result = await fetchUserCompanies();
      // setCompanies(result);
      
      // Por ahora, datos de ejemplo
      const mockData: Company[] = [];
      setCompanies(mockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar compañías';
      setError(errorMessage);
      console.error('Error loading companies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setCompanies]);

  /**
   * Crea una nueva compañía.
   * TODO: Conectar con el servicio HTTP real
   * 
   * @param {CompanyFormData} data - Datos de la compañía
   */
  const createCompany = useCallback(async (data: CompanyFormData): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const result = await createCompanyService(data);
      
      // Por ahora, crear datos mock
      const mockCompany: Company = {
        id: Date.now(),
        name: data.name,
        description: data.description || null,
        ownerId: 1, // TODO: Obtener del usuario autenticado
        logoUrl: data.logoUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        deletedAt: null
      };
      
      addCompany(mockCompany);
      return mockCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear compañía';
      setError(errorMessage);
      console.error('Error creating company:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [addCompany]);

  /**
   * Actualiza una compañía existente.
   * TODO: Conectar con el servicio HTTP real
   * 
   * @param {number} id - ID de la compañía
   * @param {Partial<CompanyFormData>} updates - Datos a actualizar
   */
  const updateCompany = useCallback(async (id: number, updates: Partial<CompanyFormData>): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const result = await updateCompanyService(id, updates);
      
      // Por ahora, actualizar solo en el store
      const existingCompany = companies.find(c => c.id === id);
      if (!existingCompany) {
        throw new Error('Compañía no encontrada');
      }
      
      const updatedCompany: Company = {
        ...existingCompany,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      updateCompanyInStore(id, updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar compañía';
      setError(errorMessage);
      console.error('Error updating company:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [companies, updateCompanyInStore]);

  /**
   * Elimina (soft delete) una compañía.
   * TODO: Conectar con el servicio HTTP real
   * 
   * @param {number} id - ID de la compañía
   */
  const deleteCompany = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con llamada real al backend
      // await deleteCompanyService(id);
      
      // Por ahora, eliminar solo del store
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
   * Sube el logo de una compañía.
   * TODO: Conectar con el servicio HTTP real
   * 
   * @param companyId - ID de la compañía
   * @param file - Archivo de imagen
   */
  const uploadLogo = useCallback(async (companyId: number, file: File): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const result = await uploadCompanyLogo(companyId, file);
      
      // Por ahora, simular URL del logo
      const mockLogoUrl = URL.createObjectURL(file);
      const existingCompany = companies.find(c => c.id === companyId);
      
      if (!existingCompany) {
        throw new Error('Compañía no encontrada');
      }
      
      const updatedCompany: Company = {
        ...existingCompany,
        logoUrl: mockLogoUrl,
        updatedAt: new Date().toISOString()
      };
      
      updateCompanyInStore(companyId, updatedCompany);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir logo';
      setError(errorMessage);
      console.error('Error uploading logo:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [companies, updateCompanyInStore]);

  /**
   * Verifica si un nombre de compañía está disponible.
   * TODO: Conectar con el servicio HTTP real
   * 
   * @param {string} name - Nombre a verificar
   */
  const checkNameAvailability = useCallback(async (name: string): Promise<boolean> => {
    try {
      // TODO: Reemplazar con llamada real al backend
      // return await checkCompanyNameAvailability(name);
      
      // Por ahora, verificar solo localmente
      const exists = companies.some(c => c.name.toLowerCase() === name.toLowerCase());
      return !exists;
    } catch (err) {
      console.error('Error checking name availability:', err);
      return false;
    }
  }, [companies]);

  return {
    companies,
    isLoading,
    error,
    loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    uploadLogo,
    checkNameAvailability
  };
};

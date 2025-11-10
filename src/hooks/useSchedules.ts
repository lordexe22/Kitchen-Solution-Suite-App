/* src/hooks/useSchedules.ts */
// #section imports
import { useState, useCallback } from 'react';
import { useCompanies } from './useCompanies';
import type { Company } from '../store/Companies.types';
import type { BranchWithLocation, BranchSchedule } from '../store/Branches.types';
// #end-section

// #interface CompanyWithBranches
/**
 * Empresa con sus sucursales cargadas.
 */
export interface CompanyWithBranches extends Company {
  branches: BranchWithLocation[];
}
// #end-interface

// #interface BranchWithSchedules
/**
 * Sucursal con sus horarios cargados.
 */
export interface BranchWithSchedules extends BranchWithLocation {
  schedules: BranchSchedule[];
  isLoadingSchedules?: boolean;
}
// #end-interface

// #hook useSchedules
/**
 * Hook especializado para gestionar horarios de todas las sucursales.
 * Carga empresas, sucursales y horarios de forma unificada.
 * 
 * @returns {object} Estado y funciones para gestionar horarios
 * 
 * @example
 * const { companiesWithBranches, isLoading, loadAllData } = useSchedules();
 */
export const useSchedules = () => {
  const { companies, loadCompanies, isLoading: isLoadingCompanies } = useCompanies();
  const [companiesWithBranches, setCompaniesWithBranches] = useState<CompanyWithBranches[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // #function loadAllData
  /**
   * Carga todas las empresas y sus sucursales.
   */
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Cargar empresas
      await loadCompanies();
      
      // Esperar un tick para que el store se actualice
      await new Promise(resolve => setTimeout(resolve, 0));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(errorMessage);
      console.error('Error loading all data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadCompanies]);
  // #end-function

  // #function refreshCompaniesWithBranches
  /**
   * Actualiza la lista de empresas con sus sucursales.
   * Debe llamarse después de que el hook useBranches haya cargado las sucursales.
   */
  const refreshCompaniesWithBranches = useCallback((
    companiesList: Company[],
    branchesByCompanyMap: Map<number, BranchWithLocation[]>
  ) => {
    const companiesWithBranchesData: CompanyWithBranches[] = companiesList.map(company => ({
      ...company,
      branches: branchesByCompanyMap.get(company.id) || []
    }));
    
    setCompaniesWithBranches(companiesWithBranchesData);
  }, []);
  // #end-function

  return {
    companies,
    companiesWithBranches,
    isLoading: isLoading || isLoadingCompanies,
    error,
    loadAllData,
    refreshCompaniesWithBranches
  };
};
// #end-hook
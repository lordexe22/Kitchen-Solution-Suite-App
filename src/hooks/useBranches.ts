/* src/hooks/useBranches.ts */
// #section imports
import { useState, useCallback } from 'react';
import { useBranchesStore } from '../store/Branches.store';
import {
  fetchCompanyBranches,
  createBranch as createBranchService,
  updateBranch as updateBranchService,
  deleteBranch as deleteBranchService,
  createOrUpdateBranchLocation,
  deleteBranchLocation as deleteBranchLocationService
} from '../services/branches/branches.service';
import type { BranchFormData, BranchLocationFormData } from '../store/Branches.types';
// #end-section

// #hook useBranches
/**
 * Hook personalizado para gestionar sucursales.
 * Implementa cache: verifica store antes de hacer fetch.
 * 
 * @param {number} companyId - ID de la compañía
 * @returns {object} Estado y funciones para gestionar sucursales
 * 
 * @example
 * const { branches, isLoading, loadBranches, createBranch } = useBranches(1);
 */
export const useBranches = (companyId: number) => {
  const {
    getBranchesForCompany,
    hasBranchesForCompany,
    setBranchesForCompany,
    addBranch,
    updateBranch: updateBranchInStore,
    removeBranch
  } = useBranchesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // #function loadBranches
  /**
   * Carga sucursales de la compañía.
   * Si ya están en el store, no hace fetch.
   */
  const loadBranches = useCallback(async (forceRefresh = false) => {
    // ✅ CACHE: Verificar si ya están en el store
    if (!forceRefresh && hasBranchesForCompany(companyId)) {
      console.log(`✅ Branches de companyId ${companyId} ya están en cache`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(`🔄 Fetching branches de companyId ${companyId}...`);
      const branches = await fetchCompanyBranches(companyId);
      setBranchesForCompany(companyId, branches);
      console.log(`✅ Branches cargadas y guardadas en store`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar sucursales';
      setError(errorMessage);
      console.error('Error loading branches:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, hasBranchesForCompany, setBranchesForCompany]);
  // #end-function

  // #function createBranch
  /**
   * Crea una nueva sucursal.
   */
  const createBranch = useCallback(async (data: BranchFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBranch = await createBranchService(data);
      addBranch(newBranch);
      return newBranch;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear sucursal';
      setError(errorMessage);
      console.error('Error creating branch:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addBranch]);
  // #end-function

  // #function updateBranchName
  /**
   * Actualiza el nombre de una sucursal.
   */
  const updateBranchName = useCallback(async (branchId: number, name: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBranch = await updateBranchService(branchId, name);
      updateBranchInStore(branchId, updatedBranch);
      return updatedBranch;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar sucursal';
      setError(errorMessage);
      console.error('Error updating branch:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateBranchInStore]);
  // #end-function

  // #function deleteBranch
  /**
   * Elimina (soft delete) una sucursal.
   */
  const deleteBranch = useCallback(async (branchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteBranchService(branchId);
      removeBranch(branchId, companyId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar sucursal';
      setError(errorMessage);
      console.error('Error deleting branch:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [removeBranch, companyId]);
  // #end-function

  // #function saveLocation
  /**
   * Guarda o actualiza la ubicación de una sucursal.
   */
  const saveLocation = useCallback(async (branchId: number, data: BranchLocationFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const location = await createOrUpdateBranchLocation(branchId, data);
      updateBranchInStore(branchId, { location });
      return location;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar ubicación';
      setError(errorMessage);
      console.error('Error saving location:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateBranchInStore]);
  // #end-function

  // #function deleteLocation
  /**
   * Elimina la ubicación de una sucursal.
   */
  const deleteLocation = useCallback(async (branchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteBranchLocationService(branchId);
      updateBranchInStore(branchId, { location: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar ubicación';
      setError(errorMessage);
      console.error('Error deleting location:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateBranchInStore]);
  // #end-function

  return {
    branches: getBranchesForCompany(companyId),
    isLoading,
    error,
    loadBranches,
    createBranch,
    updateBranchName,
    deleteBranch,
    saveLocation,
    deleteLocation
  };
};
// #end-hook
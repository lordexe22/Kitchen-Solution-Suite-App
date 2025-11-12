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
import {
  fetchBranchSocials,
  createBranchSocial as createBranchSocialService,
  updateBranchSocial as updateBranchSocialService,
  deleteBranchSocial as deleteBranchSocialService,
  applyBranchSocialsToAll as applyBranchSocialsToAllService
} from '../services/branches/branchSocials.service';
import type { BranchFormData, BranchLocationFormData, BranchSocialFormData } from '../store/Branches.types';
import {
  fetchBranchSchedules,
  updateBranchScheduleBatch,
  applySchedulesToAllBranches as applySchedulesToAllService
} from '../services/branches/branchSchedules.service';
import type { BranchScheduleFormData } from '../store/Branches.types';
import type { BranchSchedule } from '../store/Branches.types';
import type { BranchSocial } from '../store/Branches.types';
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
  // #function loadBranchSocials
  /**
   * Carga las redes sociales de una sucursal.
   */
  const loadBranchSocials = useCallback(async (branchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const socials = await fetchBranchSocials(branchId);
      return socials;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar redes sociales';
      setError(errorMessage);
      console.error('Error loading socials:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function createSocial
  /**
   * Crea una nueva red social para una sucursal.
   */
  const createSocial = useCallback(async (branchId: number, data: BranchSocialFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSocial = await createBranchSocialService(branchId, data);
      return newSocial;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear red social';
      setError(errorMessage);
      console.error('Error creating social:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function updateSocial
  /**
   * Actualiza una red social existente.
   */
  const updateSocial = useCallback(async (
    branchId: number,
    socialId: number,
    data: BranchSocialFormData
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSocial = await updateBranchSocialService(branchId, socialId, data);
      return updatedSocial;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar red social';
      setError(errorMessage);
      console.error('Error updating social:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function deleteSocial
  /**
   * Elimina una red social.
   */
  const deleteSocial = useCallback(async (branchId: number, socialId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteBranchSocialService(branchId, socialId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar red social';
      setError(errorMessage);
      console.error('Error deleting social:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function applySocialsToAllBranches
  /**
   * Aplica las redes sociales de una sucursal a todas las sucursales de la compañía.
   */
  const applySocialsToAllBranches = useCallback(async (sourceBranchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await applyBranchSocialsToAllService(companyId, sourceBranchId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar redes sociales';
      setError(errorMessage);
      console.error('Error applying socials to all:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);
  // #end-function
  // #function loadBranchSchedules
  /**
   * Carga los horarios de una sucursal.
   */
  const loadBranchSchedules = useCallback(async (branchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const schedules = await fetchBranchSchedules(branchId);
      return schedules;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar horarios';
      setError(errorMessage);
      console.error('Error loading schedules:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function updateSchedules
  /**
   * Actualiza los horarios de una sucursal.
   */
  const updateSchedules = useCallback(async (branchId: number, schedules: BranchScheduleFormData[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSchedules = await updateBranchScheduleBatch(branchId, { schedules });
      return updatedSchedules;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar horarios';
      setError(errorMessage);
      console.error('Error updating schedules:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function
  // #function applySchedulesToAll
  /**
   * Aplica los horarios de una sucursal a todas las sucursales de la compañía.
   */
  const applySchedulesToAll = useCallback(async (sourceBranchId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await applySchedulesToAllService(companyId, sourceBranchId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar horarios';
      setError(errorMessage);
      console.error('Error applying schedules to all:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);
  // #end-function
  // #function updateBranchSchedules
  /**
   * Actualiza los horarios de una sucursal en el store.
   */
  const updateBranchSchedules = useCallback((branchId: number, schedules: BranchSchedule[]) => {
    updateBranchInStore(branchId, { schedules });
  }, [updateBranchInStore]);
  // #end-function
  // #function updateBranchSocials
  /**
   * Actualiza las redes sociales de una sucursal en el store.
   */
  const updateBranchSocials = useCallback((branchId: number, socials: BranchSocial[]) => {
    updateBranchInStore(branchId, { socials });
  }, [updateBranchInStore]);
  // #end-function
  // #section return
  return {
      branches: getBranchesForCompany(companyId),
      isLoading,
      error,
      loadBranches,
      createBranch,
      updateBranchName,
      deleteBranch,
      saveLocation,
      deleteLocation,
      loadBranchSocials,
      createSocial,
      updateSocial,
      deleteSocial,
      applySocialsToAllBranches,
      loadBranchSchedules,
      updateSchedules,
      applySchedulesToAll,
      updateBranchSchedules,
      updateBranchSocials,
      updateBranchInStore
  };
  // #end-section
};
// #end-hook

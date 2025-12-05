/* src/hooks/useBranches.ts */
// #section imports
import { useCallback } from 'react';
import { useBranchesStore } from '../store/Branches.store';
import { useAsyncOperation } from './useAsyncOperation';
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
import type { BranchFormData, BranchLocationFormData, BranchSocialFormData, BranchWithLocation } from '../store/Branches.types';
import {
  fetchBranchSchedules,
  updateBranchScheduleBatch,
  applySchedulesToAllBranches as applySchedulesToAllService
} from '../services/branches/branchSchedules.service';
import type { BranchScheduleFormData } from '../store/Branches.types';
import type { BranchSchedule } from '../store/Branches.types';
import type { BranchSocial } from '../store/Branches.types';
import type { BranchLocation } from '../store/Branches.types';
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

  // Hook para operaciones asíncronas
  const { isLoading, error, execute } = useAsyncOperation();

  // #function loadBranches
  /**
   * Carga sucursales de la compañía.
   * Si ya están en el store, no hace fetch.
   */
  const loadBranches = useCallback(async (forceRefresh = false) => {
    // ✅ CACHE: Verificar si ya están en el store
    if (!forceRefresh && hasBranchesForCompany(companyId)) {
      return;
    }

    const result = await execute<BranchWithLocation[]>(
      async () => await fetchCompanyBranches(companyId),
      'Error al cargar sucursales'
    );
    if (result) {
      setBranchesForCompany(companyId, result);
    }
  }, [companyId, hasBranchesForCompany, execute, setBranchesForCompany]);
  // #end-function
  // #function createBranch
  /**
   * Crea una nueva sucursal.
   */
  const createBranch = useCallback(async (data: BranchFormData) => {
    const result = await execute<BranchWithLocation>(
      async () => await createBranchService(data),
      'Error al crear sucursal'
    );
    if (result) {
      addBranch(result);
      return result;
    }
    throw new Error('Failed to create branch');
  }, [execute, addBranch]);
  // #end-function
  // #function updateBranchName
  /**
   * Actualiza el nombre de una sucursal.
   */
  const updateBranchName = useCallback(async (branchId: number, name: string | null) => {
    const result = await execute<BranchWithLocation>(
      async () => await updateBranchService(branchId, name),
      'Error al actualizar sucursal'
    );
    if (result) {
      updateBranchInStore(branchId, result);
      return result;
    }
    throw new Error('Failed to update branch');
  }, [execute, updateBranchInStore]);
  // #end-function
  // #function deleteBranch
  /**
   * Elimina (soft delete) una sucursal.
   */
  const deleteBranch = useCallback(async (branchId: number) => {
    const result = await execute(
      async () => await deleteBranchService(branchId),
      'Error al eliminar sucursal'
    );
    if (result !== null) {
      removeBranch(branchId, companyId);
    }
  }, [execute, removeBranch, companyId]);
  // #end-function
  // #function saveLocation
  /**
   * Guarda o actualiza la ubicación de una sucursal.
   */
  const saveLocation = useCallback(async (branchId: number, data: BranchLocationFormData) => {
    const result = await execute<BranchLocation>(
      async () => {
        const location = await createOrUpdateBranchLocation(branchId, data);
        updateBranchInStore(branchId, { location });
        return location;
      },
      'Error al guardar ubicación'
    );
    if (!result) throw new Error('Error al guardar ubicación');
    return result;
  }, [execute, updateBranchInStore]);
  // #end-function
  // #function deleteLocation
  /**
   * Elimina la ubicación de una sucursal.
   */
  const deleteLocation = useCallback(async (branchId: number) => {
    await execute<void>(
      async () => {
        await deleteBranchLocationService(branchId);
        updateBranchInStore(branchId, { location: null });
      },
      'Error al eliminar ubicación'
    );
  }, [execute, updateBranchInStore]);
  // #end-function
  // #function loadBranchSocials
  /**
   * Carga las redes sociales de una sucursal.
   */
  const loadBranchSocials = useCallback(async (branchId: number) => {
    const result = await execute<BranchSocial[]>(
      async () => await fetchBranchSocials(branchId),
      'Error al cargar redes sociales'
    );
    if (!result) throw new Error('Error al cargar redes sociales');
    return result;
  }, [execute]);
  // #end-function
  // #function createSocial
  /**
   * Crea una nueva red social para una sucursal.
   */
  const createSocial = useCallback(async (branchId: number, data: BranchSocialFormData) => {
    const result = await execute<BranchSocial>(
      async () => await createBranchSocialService(branchId, data),
      'Error al crear red social'
    );
    if (!result) throw new Error('Error al crear red social');
    return result;
  }, [execute]);
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
    const result = await execute<BranchSocial>(
      async () => await updateBranchSocialService(branchId, socialId, data),
      'Error al actualizar red social'
    );
    if (!result) throw new Error('Error al actualizar red social');
    return result;
  }, [execute]);
  // #end-function
  // #function deleteSocial
  /**
   * Elimina una red social.
   */
  const deleteSocial = useCallback(async (branchId: number, socialId: number) => {
    await execute<void>(
      async () => await deleteBranchSocialService(branchId, socialId),
      'Error al eliminar red social'
    );
  }, [execute]);
  // #end-function
  // #function applySocialsToAllBranches
  /**
   * Aplica las redes sociales de una sucursal a todas las sucursales de la compañía.
   */
  const applySocialsToAllBranches = useCallback(async (sourceBranchId: number) => {
    await execute<void>(
      async () => await applyBranchSocialsToAllService(companyId, sourceBranchId),
      'Error al aplicar redes sociales'
    );
  }, [execute, companyId]);
  // #end-function
  // #function loadBranchSchedules
  /**
   * Carga los horarios de una sucursal.
   */
  const loadBranchSchedules = useCallback(async (branchId: number) => {
    const result = await execute<BranchSchedule[]>(
      async () => await fetchBranchSchedules(branchId),
      'Error al cargar horarios'
    );
    if (!result) throw new Error('Error al cargar horarios');
    return result;
  }, [execute]);
  // #end-function
  // #function updateSchedules
  /**
   * Actualiza los horarios de una sucursal.
   */
  const updateSchedules = useCallback(async (branchId: number, schedules: BranchScheduleFormData[]) => {
    const result = await execute<BranchSchedule[]>(
      async () => await updateBranchScheduleBatch(branchId, { schedules }),
      'Error al actualizar horarios'
    );
    if (!result) throw new Error('Error al actualizar horarios');
    return result;
  }, [execute]);
  // #end-function
  // #function applySchedulesToAll
  /**
   * Aplica los horarios de una sucursal a todas las sucursales de la compañía.
   */
  const applySchedulesToAll = useCallback(async (sourceBranchId: number) => {
    await execute<void>(
      async () => await applySchedulesToAllService(companyId, sourceBranchId),
      'Error al aplicar horarios'
    );
  }, [execute, companyId]);
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

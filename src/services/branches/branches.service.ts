/* src/services/branches/branches.service.ts */
// #section imports
import { fetchWithTimeout } from '../../utils/fetchWithTimeout/fetchWithTimeout';
import type { BranchWithLocation, BranchFormData, BranchLocationFormData, BranchLocation } from '../../store/Branches.types';
// #end-section

// #variable BASE_URL
const BASE_URL = 'http://localhost:4000/api/branches';
// #end-variable

// #function fetchCompanyBranches
/**
 * Obtiene todas las sucursales de una compañía específica.
 * 
 * @async
 * @param {number} companyId - ID de la compañía
 * @returns {Promise<BranchWithLocation[]>} Lista de sucursales con ubicaciones
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const branches = await fetchCompanyBranches(1);
 */
export const fetchCompanyBranches = async (companyId: number): Promise<BranchWithLocation[]> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/company/${companyId}`,
    {
      method: 'GET',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al obtener sucursales');
  }

  return responseData.data.branches;
};
// #end-function

// #function createBranch
/**
 * Crea una nueva sucursal.
 * 
 * @async
 * @param {BranchFormData} data - Datos de la sucursal
 * @returns {Promise<BranchWithLocation>} Sucursal creada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const newBranch = await createBranch({ companyId: 1, name: "Local Centro" });
 */
export const createBranch = async (data: BranchFormData): Promise<BranchWithLocation> => {
  const response = await fetchWithTimeout(
    BASE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al crear sucursal');
  }

  return { ...responseData.data.branch, location: null };
};
// #end-function

// #function updateBranch
/**
 * Actualiza el nombre de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {string | null} name - Nuevo nombre (o null)
 * @returns {Promise<BranchWithLocation>} Sucursal actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateBranch(1, "Nuevo Nombre");
 */
export const updateBranch = async (branchId: number, name: string | null): Promise<BranchWithLocation> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name }),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al actualizar sucursal');
  }

  return responseData.data.branch;
};
// #end-function

// #function deleteBranch
/**
 * Elimina (soft delete) una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteBranch(1);
 */
export const deleteBranch = async (branchId: number): Promise<void> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al eliminar sucursal');
  }
};
// #end-function

// #function createOrUpdateBranchLocation
/**
 * Crea o actualiza la ubicación de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchLocationFormData} data - Datos de la ubicación
 * @returns {Promise<BranchLocation>} Ubicación creada/actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const location = await createOrUpdateBranchLocation(1, { address: "...", city: "..." });
 */
export const createOrUpdateBranchLocation = async (
  branchId: number,
  data: BranchLocationFormData
): Promise<BranchLocation> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/location`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al guardar ubicación');
  }

  return responseData.data.location;
};
// #end-function

// #function deleteBranchLocation
/**
 * Elimina la ubicación de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteBranchLocation(1);
 */
export const deleteBranchLocation = async (branchId: number): Promise<void> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/location`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al eliminar ubicación');
  }
};
// #end-function
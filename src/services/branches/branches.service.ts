/* src/services/branches/branches.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { BranchWithLocation, BranchFormData, BranchLocationFormData, BranchLocation } from '../../store/Branches.types';
// #end-section
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
  const response = await httpClient.get<{ branches: BranchWithLocation[] }>(`/branches/company/${companyId}`);
  return response.branches;
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
  const response = await httpClient.post<{ branch: BranchWithLocation }>('/branches', data);
  return { ...response.branch, location: null };
};
// #end-function
// #function updateBranch
/**
 * Actualiza el nombre de una sucursal.
 * 
 * @async
 * @param {number} id - ID de la sucursal
 * @param {string} name - Nuevo nombre
 * @returns {Promise<BranchWithLocation>} Sucursal actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateBranch(1, "Local Sur");
 */
export const updateBranch = async (id: number, name: string): Promise<BranchWithLocation> => {
  const response = await httpClient.put<{ branch: BranchWithLocation }>(`/branches/${id}`, { name });
  return response.branch;
};
// #end-function
// #function deleteBranch
/**
 * Elimina una sucursal (soft delete).
 * 
 * @async
 * @param {number} id - ID de la sucursal
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteBranch(1);
 */
export const deleteBranch = async (id: number): Promise<void> => {
  await httpClient.delete(`/branches/${id}`);
};
// #end-function
// #function createOrUpdateBranchLocation
/**
 * Crea o actualiza la ubicación de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchLocationFormData} data - Datos de la ubicación
 * @returns {Promise<BranchLocation>} Ubicación creada o actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const location = await createOrUpdateBranchLocation(1, { address: "Calle 123" });
 */
export const createOrUpdateBranchLocation = async (
  branchId: number,
  data: BranchLocationFormData
): Promise<BranchLocation> => {
  const response = await httpClient.post<{ location: BranchLocation }>(`/branches/${branchId}/location`, data);
  return response.location;
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
  await httpClient.delete(`/branches/${branchId}/location`);
};
// #end-function
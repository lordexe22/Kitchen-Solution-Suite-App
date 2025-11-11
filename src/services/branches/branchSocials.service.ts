/* src/services/branches/branchSocials.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { BranchSocial, BranchSocialFormData } from '../../store/Branches.types';
// #end-section
// #function fetchBranchSocials
/**
 * Obtiene todas las redes sociales de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<BranchSocial[]>} Lista de redes sociales
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const socials = await fetchBranchSocials(1);
 */
export const fetchBranchSocials = async (branchId: number): Promise<BranchSocial[]> => {
  const response = await httpClient.get<{ socials: BranchSocial[] }>(`/branches/${branchId}/socials`);
  return response.socials;
};
// #end-function
// #function createBranchSocial
/**
 * Crea una nueva red social para una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchSocialFormData} data - Datos de la red social
 * @returns {Promise<BranchSocial>} Red social creada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const social = await createBranchSocial(1, { 
 *   platform: 'facebook', 
 *   url: 'https://facebook.com/empresa' 
 * });
 */
export const createBranchSocial = async (
  branchId: number,
  data: BranchSocialFormData
): Promise<BranchSocial> => {
  const response = await httpClient.post<{ social: BranchSocial }>(`/branches/${branchId}/socials`, data);
  return response.social;
};
// #end-function
// #function updateBranchSocial
/**
 * Actualiza una red social existente.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} socialId - ID de la red social
 * @param {Partial<BranchSocialFormData>} updates - Datos a actualizar
 * @returns {Promise<BranchSocial>} Red social actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateBranchSocial(1, 5, { url: 'https://facebook.com/nueva-url' });
 */
export const updateBranchSocial = async (
  branchId: number,
  socialId: number,
  updates: Partial<BranchSocialFormData>
): Promise<BranchSocial> => {
  const response = await httpClient.put<{ social: BranchSocial }>(`/branches/${branchId}/socials/${socialId}`, updates);
  return response.social;
};
// #end-function
// #function deleteBranchSocial
/**
 * Elimina una red social de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} socialId - ID de la red social
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteBranchSocial(1, 5);
 */
export const deleteBranchSocial = async (branchId: number, socialId: number): Promise<void> => {
  await httpClient.delete(`/branches/${branchId}/socials/${socialId}`);
};
// #end-function
// #function applyBranchSocialsToAll
/**
 * Aplica las redes sociales de una sucursal a todas las sucursales de la compañía.
 * 
 * @async
 * @param {number} sourceBranchId - ID de la sucursal origen
 * @param {number} companyId - ID de la compañía
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await applyBranchSocialsToAll(1, 5);
 */
export const applyBranchSocialsToAll = async (
  sourceBranchId: number,
  companyId: number
): Promise<void> => {
  await httpClient.post(`/branches/${sourceBranchId}/socials/apply-to-all`, { companyId });
};
// #end-function
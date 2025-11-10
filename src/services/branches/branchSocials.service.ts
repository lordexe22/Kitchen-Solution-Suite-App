/* src/services/branches/branchSocials.service.ts */
// #section imports
import { fetchWithTimeout } from '../../utils/fetchWithTimeout/fetchWithTimeout';
import type { BranchSocial, BranchSocialFormData } from '../../store/Branches.types';
// #end-section

// #variable BASE_URL
const BASE_URL = 'http://localhost:4000/api/branches';
// #end-variable

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
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/socials`,
    {
      method: 'GET',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al obtener redes sociales');
  }

  return responseData.data.socials;
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
 * const social = await createBranchSocial(1, { platform: 'facebook', url: 'https://...' });
 */
export const createBranchSocial = async (
  branchId: number,
  data: BranchSocialFormData
): Promise<BranchSocial> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/socials`,
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
    throw new Error(responseData.error || 'Error al crear red social');
  }

  return responseData.data.social;
};
// #end-function

// #function updateBranchSocial
/**
 * Actualiza una red social existente.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} socialId - ID de la red social
 * @param {BranchSocialFormData} data - Datos actualizados
 * @returns {Promise<BranchSocial>} Red social actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateBranchSocial(1, 5, { platform: 'facebook', url: 'https://...' });
 */
export const updateBranchSocial = async (
  branchId: number,
  socialId: number,
  data: BranchSocialFormData
): Promise<BranchSocial> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/socials/${socialId}`,
    {
      method: 'PUT',
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
    throw new Error(responseData.error || 'Error al actualizar red social');
  }

  return responseData.data.social;
};
// #end-function

// #function deleteBranchSocial
/**
 * Elimina una red social.
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
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/socials/${socialId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al eliminar red social');
  }
};
// #end-function
// #function applyBranchSocialsToAll
/**
 * Aplica las redes sociales de una sucursal a todas las sucursales de la compañía.
 * 
 * @async
 * @param {number} companyId - ID de la compañía
 * @param {number} sourceBranchId - ID de la sucursal fuente
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await applyBranchSocialsToAll(1, 5);
 */
export const applyBranchSocialsToAll = async (
  companyId: number,
  sourceBranchId: number
): Promise<void> => {
  const response = await fetchWithTimeout(
    `http://localhost:4000/api/companies/${companyId}/apply-socials/${sourceBranchId}`,
    {
      method: 'POST',
      credentials: 'include',
    },
    30000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al aplicar redes sociales');
  }
};
// #end-function
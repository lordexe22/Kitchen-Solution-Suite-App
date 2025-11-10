/* src/services/branches/branchSchedules.service.ts */
// #section imports
import { fetchWithTimeout } from '../../utils/fetchWithTimeout/fetchWithTimeout';
import type { BranchSchedule, BranchScheduleFormData, BranchScheduleBatchData } from '../../store/Branches.types';
// #end-section
// #variable BASE_URL
const BASE_URL = 'http://localhost:4000/api/branches';
// #end-variable
// #function fetchBranchSchedules
/**
 * Obtiene todos los horarios de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<BranchSchedule[]>} Lista de horarios
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const schedules = await fetchBranchSchedules(1);
 */
export const fetchBranchSchedules = async (branchId: number): Promise<BranchSchedule[]> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/schedules`,
    {
      method: 'GET',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al obtener horarios');
  }

  return responseData.data.schedules;
};
// #end-function
// #function createBranchSchedule
/**
 * Crea un nuevo horario para una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchScheduleFormData} data - Datos del horario
 * @returns {Promise<BranchSchedule>} Horario creado
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const schedule = await createBranchSchedule(1, { 
 *   dayOfWeek: 'monday', 
 *   openTime: '09:00', 
 *   closeTime: '18:00', 
 *   isClosed: false 
 * });
 */
export const createBranchSchedule = async (
  branchId: number,
  data: BranchScheduleFormData
): Promise<BranchSchedule> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/schedules`,
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
    throw new Error(responseData.error || 'Error al crear horario');
  }

  return responseData.data.schedule;
};
// #end-function
// #function updateBranchScheduleBatch
/**
 * Actualiza múltiples horarios de una sucursal a la vez.
 * Esta función elimina los horarios existentes y crea nuevos.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchScheduleBatchData} data - Array de horarios
 * @returns {Promise<BranchSchedule[]>} Horarios actualizados
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const schedules = await updateBranchScheduleBatch(1, {
 *   schedules: [
 *     { dayOfWeek: 'monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
 *     { dayOfWeek: 'sunday', isClosed: true }
 *   ]
 * });
 */
export const updateBranchScheduleBatch = async (
  branchId: number,
  data: BranchScheduleBatchData
): Promise<BranchSchedule[]> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/schedules/batch`,
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
    throw new Error(responseData.error || 'Error al actualizar horarios');
  }

  return responseData.data.schedules;
};
// #end-function
// #function updateBranchSchedule
/**
 * Actualiza un horario específico.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} scheduleId - ID del horario
 * @param {BranchScheduleFormData} data - Datos actualizados
 * @returns {Promise<BranchSchedule>} Horario actualizado
 * @throws {Error} Si la solicitud falla
 */
export const updateBranchSchedule = async (
  branchId: number,
  scheduleId: number,
  data: BranchScheduleFormData
): Promise<BranchSchedule> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/schedules/${scheduleId}`,
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
    throw new Error(responseData.error || 'Error al actualizar horario');
  }

  return responseData.data.schedule;
};
// #end-function
// #function deleteBranchSchedule
/**
 * Elimina un horario específico.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} scheduleId - ID del horario
 * @throws {Error} Si la solicitud falla
 */
export const deleteBranchSchedule = async (
  branchId: number,
  scheduleId: number
): Promise<void> => {
  const response = await fetchWithTimeout(
    `${BASE_URL}/${branchId}/schedules/${scheduleId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al eliminar horario');
  }
};
// #end-function
// #function applySchedulesToAllBranches
/**
 * Aplica los horarios de una sucursal a todas las sucursales de la misma compañía.
 * 
 * @async
 * @param {number} companyId - ID de la compañía
 * @param {number} sourceBranchId - ID de la sucursal origen
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await applySchedulesToAllBranches(1, 5);
 */
export const applySchedulesToAllBranches = async (
  companyId: number,
  sourceBranchId: number
): Promise<void> => {
  const response = await fetchWithTimeout(
    `http://localhost:4000/api/companies/${companyId}/apply-schedules/${sourceBranchId}`,
    {
      method: 'POST',
      credentials: 'include',
    },
    30000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al aplicar horarios a todas las sucursales');
  }
};
// #end-function
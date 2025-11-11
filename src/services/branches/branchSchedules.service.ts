/* src/services/branches/branchSchedules.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { BranchSchedule, BranchScheduleFormData, BranchScheduleBatchData } from '../../store/Branches.types';
// #end-section
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
  const response = await httpClient.get<{ schedules: BranchSchedule[] }>(`/branches/${branchId}/schedules`);
  return response.schedules;
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
  const response = await httpClient.post<{ schedule: BranchSchedule }>(`/branches/${branchId}/schedules`, data);
  return response.schedule;
};
// #end-function
// #function updateBranchScheduleBatch
/**
 * Actualiza múltiples horarios de una sucursal a la vez.
 * Esta función elimina los horarios existentes y crea nuevos.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {BranchScheduleBatchData} data - Datos de los horarios a actualizar
 * @returns {Promise<BranchSchedule[]>} Horarios actualizados
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const schedules = await updateBranchScheduleBatch(1, {
 *   schedules: [
 *     { dayOfWeek: 'monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
 *     { dayOfWeek: 'tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false }
 *   ]
 * });
 */
export const updateBranchScheduleBatch = async (
  branchId: number,
  data: BranchScheduleBatchData
): Promise<BranchSchedule[]> => {
  const response = await httpClient.put<{ schedules: BranchSchedule[] }>(`/branches/${branchId}/schedules/batch`, data);
  return response.schedules;
};
// #end-function
// #function updateBranchSchedule
/**
 * Actualiza un horario específico de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} scheduleId - ID del horario
 * @param {Partial<BranchScheduleFormData>} updates - Datos a actualizar
 * @returns {Promise<BranchSchedule>} Horario actualizado
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateBranchSchedule(1, 5, { openTime: '10:00' });
 */
export const updateBranchSchedule = async (
  branchId: number,
  scheduleId: number,
  updates: Partial<BranchScheduleFormData>
): Promise<BranchSchedule> => {
  const response = await httpClient.put<{ schedule: BranchSchedule }>(`/branches/${branchId}/schedules/${scheduleId}`, updates);
  return response.schedule;
};
// #end-function
// #function deleteBranchSchedule
/**
 * Elimina un horario de una sucursal.
 * 
 * @async
 * @param {number} branchId - ID de la sucursal
 * @param {number} scheduleId - ID del horario
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteBranchSchedule(1, 5);
 */
export const deleteBranchSchedule = async (branchId: number, scheduleId: number): Promise<void> => {
  await httpClient.delete(`/branches/${branchId}/schedules/${scheduleId}`);
};
// #end-function
// #function applySchedulesToAllBranches
/**
 * Aplica los horarios de una sucursal a todas las sucursales de la compañía.
 * 
 * @async
 * @param {number} sourceBranchId - ID de la sucursal origen
 * @param {number} companyId - ID de la compañía
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await applySchedulesToAllBranches(1, 5);
 */
export const applySchedulesToAllBranches = async (
  sourceBranchId: number,
  companyId: number
): Promise<void> => {
  await httpClient.post(`/branches/${sourceBranchId}/schedules/apply-to-all`, { companyId });
};
// #end-function
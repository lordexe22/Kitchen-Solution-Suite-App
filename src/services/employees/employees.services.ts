/* src/services/employees/employees.services.ts */

import { httpClient } from '../../api/httpClient.instance';
import type { EmployeeResponse, EmployeeListFilters, EmployeeUpdatePermissionsDTO } from './employees.types';
import type { EmployeePermissions } from '../../config/permissions.config';

// #function getEmployees - obtiene lista de empleados filtrada
/**
 * Obtiene empleados según filtros (companyId, branchId, state, isActive).
 * 
 * @param filters - Filtros opcionales para búsqueda
 * @returns Promise con array de empleados
 * @throws Error si la petición falla
 */
export const getEmployees = async (
  filters?: EmployeeListFilters
): Promise<EmployeeResponse[]> => {
  const params = new URLSearchParams();
  
  if (filters?.companyId) params.append('companyId', filters.companyId.toString());
  if (filters?.branchId) params.append('branchId', filters.branchId.toString());
  if (filters?.state) params.append('state', filters.state);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

  const queryString = params.toString();
  const url = `/employees${queryString ? `?${queryString}` : ''}`;

  console.log('[employees.services] GET', url);

  try {
    const response = await httpClient.get<EmployeeResponse[]>(url);
    console.log('[employees.services] ✓ empleados obtenidos', { count: response?.length });
    return response || [];
  } catch (error) {
    console.error('[employees.services] ✗ error obteniendo empleados', error);
    throw error;
  }
};
// #end-function

// #function updateEmployeePermissions - actualiza permisos de un empleado
/**
 * Actualiza los permisos de un empleado específico.
 * 
 * @param employeeId - ID del empleado a actualizar
 * @param permissions - Nuevos permisos
 * @returns Promise con empleado actualizado
 * @throws Error si la petición falla
 */
export const updateEmployeePermissions = async (
  employeeId: number,
  permissions: EmployeePermissions
): Promise<EmployeeResponse> => {
  const url = `/employees/${employeeId}/permissions`;
  const payload: EmployeeUpdatePermissionsDTO = { permissions };

  console.log('[employees.services] PUT', url, { permissionKeys: Object.keys(permissions || {}) });

  try {
    const response = await httpClient.put<EmployeeResponse>(url, payload);
    console.log('[employees.services] ✓ permisos actualizados', { employeeId });
    return response;
  } catch (error) {
    console.error('[employees.services] ✗ error actualizando permisos', error);
    throw error;
  }
};
// #end-function

// #function deactivateEmployee - desactiva un empleado
/**
 * Desactiva (soft delete) un empleado.
 * 
 * @param employeeId - ID del empleado a desactivar
 * @returns Promise void
 * @throws Error si la petición falla
 */
export const deactivateEmployee = async (
  employeeId: number
): Promise<void> => {
  const url = `/employees/${employeeId}`;

  console.log('[employees.services] DELETE', url);

  try {
    await httpClient.delete(url);
    console.log('[employees.services] ✓ empleado desactivado', { employeeId });
  } catch (error) {
    console.error('[employees.services] ✗ error desactivando empleado', error);
    throw error;
  }
};
// #end-function

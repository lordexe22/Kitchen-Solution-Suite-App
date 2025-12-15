/* src/services/employees/employees.types.ts */

import type { EmployeePermissions } from '../../config/permissions.config';

// #interface EmployeeListFilters
/**
 * Filtros para listar empleados desde el cliente.
 */
export interface EmployeeListFilters {
  companyId?: number;
  branchId?: number;
  state?: 'pending' | 'active' | 'suspended';
  isActive?: boolean;
}
// #end-interface

// #interface EmployeeUpdatePermissionsDTO
/**
 * DTO para actualizar permisos de un empleado.
 */
export interface EmployeeUpdatePermissionsDTO {
  permissions: EmployeePermissions;
}
// #end-interface

// #interface EmployeeResponse
/**
 * Respuesta con datos de un empleado.
 */
export interface EmployeeResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  type: 'employee';
  branchId: number;
  permissions: EmployeePermissions | null;
  state: 'pending' | 'active' | 'suspended';
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
// #end-interface

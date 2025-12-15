/* src/config/permissions.config.ts */

// #const EMPLOYEE_PERMISSION_MODULES
/**
 * Módulos del sistema sobre los que se pueden asignar permisos.
 * 
 * Cada módulo representa una sección de la sucursal que el empleado
 * podría gestionar según los permisos otorgados por el administrador.
 */
export const EMPLOYEE_PERMISSION_MODULES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SCHEDULES: 'schedules',
  SOCIALS: 'socials',
  LOCATION: 'location',
  BRANCH_INFO: 'branchInfo',
} as const;
// #end-const

// #type PermissionAction
/**
 * Acciones posibles sobre cada módulo.
 * 
 * - canView: Permiso de lectura/visualización
 * - canCreate: Permiso para crear nuevos recursos
 * - canEdit: Permiso para modificar recursos existentes
 * - canDelete: Permiso para eliminar recursos
 */
export type PermissionAction = 'canView' | 'canCreate' | 'canEdit' | 'canDelete';
// #end-type

// #interface ModulePermissions
/**
 * Estructura de permisos para un módulo específico.
 * Todas las acciones son opcionales (undefined = sin permiso).
 */
export interface ModulePermissions {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}
// #end-interface

// #interface EmployeePermissions
/**
 * Estructura completa de permisos de un empleado.
 * 
 * Cada módulo puede tener permisos granulares de lectura/escritura.
 * Por defecto, un empleado nuevo no tiene permisos (todo false/undefined).
 */
export interface EmployeePermissions {
  products?: ModulePermissions;
  categories?: ModulePermissions;
  schedules?: ModulePermissions;
  socials?: ModulePermissions;
  location?: Omit<ModulePermissions, 'canCreate' | 'canDelete'>; // Solo view y edit
  branchInfo?: Omit<ModulePermissions, 'canCreate' | 'canDelete'>; // Solo view y edit
}
// #end-interface

// #const DEFAULT_EMPLOYEE_PERMISSIONS
/**
 * Permisos por defecto para un empleado nuevo.
 * 
 * Configuración conservadora:
 * - Solo lectura en productos, categorías e información de sucursal
 * - Sin acceso a horarios, redes sociales ni ubicación
 */
export const DEFAULT_EMPLOYEE_PERMISSIONS: EmployeePermissions = {
  products: { 
    canView: true, 
    canCreate: false, 
    canEdit: false, 
    canDelete: false 
  },
  categories: { 
    canView: true, 
    canCreate: false, 
    canEdit: false, 
    canDelete: false 
  },
  schedules: { 
    canView: false, 
    canCreate: false, 
    canEdit: false, 
    canDelete: false 
  },
  socials: { 
    canView: false, 
    canCreate: false, 
    canEdit: false, 
    canDelete: false 
  },
  location: { 
    canView: false, 
    canEdit: false 
  },
  branchInfo: { 
    canView: true, 
    canEdit: false 
  },
};
// #end-const

// #function hasPermission
/**
 * Verifica si un conjunto de permisos incluye una acción específica en un módulo.
 * 
 * @param permissions - Objeto de permisos del empleado
 * @param module - Módulo a verificar
 * @param action - Acción a verificar
 * @returns true si el permiso está explícitamente en true, false caso contrario
 */
export function hasPermission(
  permissions: EmployeePermissions | null | undefined,
  module: keyof EmployeePermissions,
  action: PermissionAction
): boolean {
  if (!permissions) return false;
  
  const modulePermissions = permissions[module];
  if (!modulePermissions) return false;
  
  if (!(action in modulePermissions)) return false;
  
  return modulePermissions[action as keyof typeof modulePermissions] === true;
}
// #end-function

/* src/config/permissions.config.ts */

// #const EMPLOYEE_PERMISSION_MODULES
/**
 * Módulos del sistema sobre los que se pueden asignar permisos.
 * 
 * Cada módulo representa una sección de la sucursal que el empleado
 * podría gestionar según los permisos otorgados por el administrador.
 * 
 * NOTA: El módulo 'products' incluye tanto productos como categorías.
 */
export const EMPLOYEE_PERMISSION_MODULES = {
  PRODUCTS: 'products',
  SCHEDULES: 'schedules',
  SOCIALS: 'socials',
} as const;
// #end-const

// #type PermissionAction
/**
 * Acciones posibles sobre cada módulo.
 * 
 * - canView: Permiso de lectura/visualización
 * - canEdit: Permiso para modificar, crear y eliminar recursos
 */
export type PermissionAction = 'canView' | 'canEdit';
// #end-type

// #interface ModulePermissions
/**
 * Estructura de permisos para un módulo específico.
 * Todas las acciones son opcionales (undefined = sin permiso).
 */
export interface ModulePermissions {
  canView?: boolean;
  canEdit?: boolean;
}
// #end-interface

// #interface EmployeePermissions
/**
 * Estructura completa de permisos de un empleado.
 * 
 * Cada módulo puede tener permisos granulares de lectura/escritura.
 * Por defecto, un empleado nuevo no tiene permisos (todo false/undefined).
 * 
 * NOTA: El módulo 'products' incluye tanto productos como categorías.
 */
export interface EmployeePermissions {
  products?: ModulePermissions;
  schedules?: ModulePermissions;
  socials?: ModulePermissions;
}
// #end-interface

// #const DEFAULT_EMPLOYEE_PERMISSIONS
/**
 * Permisos por defecto para un empleado nuevo.
 * 
 * Configuración conservadora (zero-trust):
 * - Sin permisos por defecto en ningún módulo
 * - El administrador debe otorgar permisos explícitamente
 */
export const DEFAULT_EMPLOYEE_PERMISSIONS: EmployeePermissions = {
  products: { 
    canView: false, 
    canEdit: false
  },
  schedules: { 
    canView: false, 
    canEdit: false
  },
  socials: { 
    canView: false, 
    canEdit: false
  },
};
// #end-const

// #function hasPermission
/**
 * @description Verifica si un conjunto de permisos incluye una acción específica en un módulo.
 * @purpose Centralizar la lógica de verificación de permisos con la regla de que canEdit implica canView.
 * @context Utilizado por componentes y guards del dashboard para controlar el acceso por módulo y acción.
 * @param permissions objeto de permisos del empleado
 * @param module módulo a verificar (products, schedules, socials)
 * @param action acción a verificar (canView, canEdit)
 * @returns true si el permiso está explícitamente en true, false en caso contrario
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
  
  // Si solicita canView y tiene canEdit, permitir (canEdit implica canView)
  if (action === 'canView' && modulePermissions['canEdit'] === true) {
    return true;
  }
  
  return modulePermissions[action as keyof typeof modulePermissions] === true;
}
// #end-function

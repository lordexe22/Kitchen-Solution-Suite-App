// src/hooks/useModulePermissions.ts

import { useUserDataStore } from '../store/UserData.store';
import { hasPermission, type EmployeePermissions } from '../config/permissions.config';

// #interface UseModulePermissionsResult
/**
 * Resultado del hook useModulePermissions
 */
export interface UseModulePermissionsResult {
  /** Si el usuario puede ver el módulo */
  canView: boolean;
  /** Si el usuario puede editar el módulo */
  canEdit: boolean;
  /** Si el usuario es employee (requiere verificación de permisos) */
  isEmployee: boolean;
  /** Tipo de usuario */
  userType: string | null;
}
// #end-interface

// #hook useModulePermissions
/**
 * Hook para verificar permisos de un módulo específico.
 * 
 * Lógica de permisos:
 * - Usuarios admin/ownership: siempre tienen acceso completo (canView=true, canEdit=true)
 * - Usuarios employee: verifican permisos específicos del módulo
 * - Otros usuarios: sin acceso (canView=false, canEdit=false)
 * 
 * @param moduleName - Nombre del módulo a verificar (debe coincidir con las keys de EmployeePermissions)
 * @returns Objeto con canView, canEdit, isEmployee y userType
 * 
 * @example
 * const { canView, canEdit } = useModulePermissions('products');
 * 
 * if (!canView) return <div>Sin acceso</div>;
 * 
 * return (
 *   <div>
 *     <ViewContent />
 *     {canEdit && <EditButtons />}
 *   </div>
 * );
 */
export function useModulePermissions(
  moduleName: keyof EmployeePermissions
): UseModulePermissionsResult {
  const userType = useUserDataStore((s) => s.type);
  const permissions = useUserDataStore((s) => s.permissions);

  const isEmployee = userType === 'employee';

  // Admin y ownership siempre tienen acceso completo
  if (userType === 'admin' || userType === 'ownership') {
    return {
      canView: true,
      canEdit: true,
      isEmployee: false,
      userType,
    };
  }

  // Employee: verificar permisos específicos
  if (isEmployee) {
    const canViewModule = hasPermission(permissions, moduleName, 'canView');
    const canEditModule = hasPermission(permissions, moduleName, 'canEdit');

    return {
      canView: canViewModule,
      canEdit: canEditModule,
      isEmployee: true,
      userType,
    };
  }

  // Otros usuarios (guest, dev, etc.): sin acceso por defecto
  return {
    canView: false,
    canEdit: false,
    isEmployee: false,
    userType,
  };
}
// #end-hook

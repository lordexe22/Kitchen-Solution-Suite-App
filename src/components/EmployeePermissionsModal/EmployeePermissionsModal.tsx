/* src/components/EmployeePermissionsModal/EmployeePermissionsModal.tsx */

import { useState } from 'react';
import type { EmployeeResponse } from '../../services/employees';
import type { EmployeePermissions, PermissionAction, ModulePermissions } from '../../config/permissions.config.ts';
import { EMPLOYEE_PERMISSION_MODULES } from '../../config/permissions.config.ts';
import { updateEmployeePermissions, deactivateEmployee } from '../../services/employees';
import ServerErrorBanner from '../ServerErrorBanner';
import styles from './EmployeePermissionsModal.module.css';
import '/src/styles/button.css';

// #interface EmployeePermissionsModalProps
interface EmployeePermissionsModalProps {
  employee: EmployeeResponse;
  onClose: () => void;
  onUpdate: (updated: EmployeeResponse) => void;
}
// #end-interface

// #component EmployeePermissionsModal
/**
 * Modal para gestionar permisos de un empleado.
 * 
 * Muestra:
 * - Info del empleado (nombre, email, fecha creación, sucursal)
 * - Grid de permisos (módulo × acción)
 * - Botones: Guardar, Dar de baja
 */
const EmployeePermissionsModal = ({ employee, onClose, onUpdate }: EmployeePermissionsModalProps) => {
  const [permissions, setPermissions] = useState<EmployeePermissions>(
    employee.permissions || {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // #function handlePermissionChange
  const handlePermissionChange = (module: keyof EmployeePermissions, action: PermissionAction, value: boolean) => {
    setPermissions((prev: EmployeePermissions) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }));
  };
  // #end-function

  // #function handleSave
  const handleSave = async () => {
    setIsSaving(true);
    setServerError(null);
    try {
      const updated = await updateEmployeePermissions(employee.id, permissions);
      onUpdate(updated);
      onClose();
    } catch (error) {
      console.error('[EmployeePermissionsModal] Error guardando permisos:', error);
      setServerError('Error al guardar permisos. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };
  // #end-function

  // #function handleDeactivate
  const handleDeactivate = async () => {
    if (!confirm('¿Estás seguro de que deseas dar de baja este empleado?')) {
      return;
    }
    
    setIsDeactivating(true);
    setServerError(null);
    try {
      await deactivateEmployee(employee.id);
      onUpdate({ ...employee, isActive: false, state: 'suspended' });
      onClose();
    } catch (error) {
      console.error('[EmployeePermissionsModal] Error dando de baja:', error);
      setServerError('Error al dar de baja el empleado. Intenta de nuevo.');
    } finally {
      setIsDeactivating(false);
    }
  };
  // #end-function

  // #function getModuleLabel
  const getModuleLabel = (module: string): string => {
    const labels: Record<string, string> = {
      products: 'Productos',
      categories: 'Categorías',
      schedules: 'Horarios',
      socials: 'Redes Sociales',
      location: 'Ubicación',
      branchInfo: 'Información de Sucursal'
    };
    return labels[module] || module;
  };
  // #end-function

  // #function getActionLabel
  const getActionLabel = (action: PermissionAction): string => {
    const labels: Record<PermissionAction, string> = {
      canView: 'Ver',
      canCreate: 'Crear',
      canEdit: 'Editar',
      canDelete: 'Eliminar'
    };
    return labels[action];
  };
  // #end-function

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* #section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Permisos de Empleado</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        {/* #end-section */}

        {/* #section Content */}
        <div className={styles.content}>
          {/* #subsection Info */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Información del Empleado</h3>
            <div className={styles.infoGrid}>
              <div>
                <label>Nombre</label>
                <p>{employee.firstName} {employee.lastName}</p>
              </div>
              <div>
                <label>Email</label>
                <p>{employee.email}</p>
              </div>
              <div>
                <label>Creado</label>
                <p>{new Date(employee.createdAt).toLocaleDateString('es-AR')}</p>
              </div>
              <div>
                <label>Sucursal</label>
                <p>ID: {employee.branchId}</p>
              </div>
            </div>
          </div>
          {/* #end-subsection */}

          {/* #subsection Permissions */}
          <div className={styles.permissionsSection}>
            <h3 className={styles.sectionTitle}>Permisos por Módulo</h3>
            
            {serverError && <ServerErrorBanner message={serverError} onClose={() => setServerError(null)} />}

            <div className={styles.permissionsGrid}>
              {(Object.values(EMPLOYEE_PERMISSION_MODULES) as string[]).map((module) => {
                const moduleKey = module as keyof EmployeePermissions;
                const modulePerms = (permissions[moduleKey] as ModulePermissions | undefined) || {};
                
                // Determinar qué acciones mostrar según el módulo
                const actions: PermissionAction[] = 
                  (moduleKey === 'location' || moduleKey === 'branchInfo')
                    ? ['canView', 'canEdit']
                    : ['canView', 'canCreate', 'canEdit', 'canDelete'];

                return (
                  <div key={module} className={styles.moduleCard}>
                    <h4 className={styles.moduleName}>{getModuleLabel(module)}</h4>
                    <div className={styles.actionCheckboxes}>
                      {actions.map(action => (
                        <label key={action} className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={modulePerms[action] === true}
                            onChange={(e) => handlePermissionChange(moduleKey, action, e.target.checked)}
                            disabled={isSaving || isDeactivating}
                          />
                          <span>{getActionLabel(action)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* #end-subsection */}
        </div>
        {/* #end-section */}

        {/* #section Footer */}
        <div className={styles.footer}>
          <button
            className="button button-danger"
            onClick={handleDeactivate}
            disabled={isSaving || isDeactivating || !employee.isActive}
          >
            {isDeactivating ? 'Dando de baja...' : 'Dar de Baja'}
          </button>
          
          <div className={styles.footerRight}>
            <button
              className="button button-secondary"
              onClick={onClose}
              disabled={isSaving || isDeactivating}
            >
              Cancelar
            </button>
            <button
              className="button button-primary"
              onClick={handleSave}
              disabled={isSaving || isDeactivating}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
        {/* #end-section */}
      </div>
    </div>
  );
};
// #end-component

export default EmployeePermissionsModal;

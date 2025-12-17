/* src/components/EmployeePermissionsModal/EmployeePermissionsModal.tsx */

import { useState, useEffect, useCallback } from 'react';
import type { EmployeeResponse } from '../../services/employees';
import type { EmployeePermissions, PermissionAction, ModulePermissions } from '../../config/permissions.config.ts';
import { EMPLOYEE_PERMISSION_MODULES, DEFAULT_EMPLOYEE_PERMISSIONS } from '../../config/permissions.config.ts';
import { deactivateEmployee } from '../../services/employees';
import { useEmployeePermissions, useUpdateEmployeePermissions } from '../../hooks/useEmployeePermissions';
import ServerErrorBanner from '../ServerErrorBanner';
import styles from './EmployeePermissionsModal.module.css';
import '/src/styles/button.css';
import '/src/styles/modal.css';

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
 * Características:
 * - Carga automática de permisos actuales del servidor
 * - Detección de cambios no guardados
 * - Confirmación al cerrar modal con cambios pendientes
 * - Estados de carga independientes para guardar y dar de baja
 * 
 * Muestra:
 * - Info del empleado (nombre, email, fecha creación, sucursal)
 * - Grid de permisos (módulo × acción)
 * - Botones: Guardar, Dar de baja, Cancelar
 * 
 * @example
 * <EmployeePermissionsModal 
 *   employee={employee}
 *   onClose={handleClose}
 *   onUpdate={handleUpdate}
 * />
 */
const EmployeePermissionsModal = ({ employee, onClose, onUpdate }: EmployeePermissionsModalProps) => {
  // #state Loading & Data
  const { permissions: loadedPermissions, loading: isLoadingPermissions, error: loadError } = 
    useEmployeePermissions(employee?.id || null);
  
  const { updatePermissions: updateViaHook } = useUpdateEmployeePermissions();
  
  // #state UI & Interactions
  const [permissions, setPermissions] = useState<EmployeePermissions>(DEFAULT_EMPLOYEE_PERMISSIONS);
  const [initialPermissions, setInitialPermissions] = useState<EmployeePermissions>(DEFAULT_EMPLOYEE_PERMISSIONS);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // #end-state

  // #step 1 - Cargar permisos del servidor cuando el modal abre
  useEffect(() => {
    if (loadedPermissions) {
      console.log('[EmployeePermissionsModal] 📥 Permisos cargados del servidor:', loadedPermissions);
      setInitialPermissions(loadedPermissions);
      setPermissions(loadedPermissions);
      setHasUnsavedChanges(false);
    }
  }, [loadedPermissions]);
  // #end-step

  // #step 2 - Detectar cambios en los permisos
  useEffect(() => {
    const changed = JSON.stringify(permissions) !== JSON.stringify(initialPermissions);
    if (changed) {
      console.log('[EmployeePermissionsModal] 🔄 Cambios detectados en permisos');
    }
    setHasUnsavedChanges(changed);
  }, [permissions, initialPermissions]);
  // #end-step

  const ACTIONS: PermissionAction[] = ['canView', 'canEdit'];
  const emptyModulePerms: ModulePermissions = {
    canView: false,
    canEdit: false
  };

  // #function handlePermissionChange
  /**
   * Actualiza un permiso específico para un módulo y acción.
   */
  const handlePermissionChange = useCallback((module: keyof EmployeePermissions, action: PermissionAction, value: boolean) => {
    setPermissions((prev: EmployeePermissions) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }));
  }, []);
  // #end-function

  // #function handleSave
  /**
   * Guarda los cambios de permisos en el servidor y cierra el modal.
   */
  const handleSave = async () => {
    console.log('[EmployeePermissionsModal] 💾 Iniciando guardado de permisos...', permissions);
    setIsSaving(true);
    setServerError(null);
    try {
      const result = await updateViaHook(employee.id, permissions);
      if (result.success) {
        console.log('[EmployeePermissionsModal] ✅ Permisos guardados exitosamente, cerrando modal');
        setInitialPermissions(permissions);
        setHasUnsavedChanges(false);
        onClose();
      } else {
        console.error('[EmployeePermissionsModal] ❌ Error en resultado:', result.error);
        setServerError('Error al guardar permisos. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('[EmployeePermissionsModal] ❌ Error guardando permisos:', error);
      setServerError('Error al guardar permisos. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };
  // #end-function

  // #function handleCloseWithCheck
  /**
   * Verifica si hay cambios sin guardar antes de cerrar.
   * Si los hay, muestra confirmación.
   */
  const handleCloseWithCheck = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);
  // #end-function

  // #function handleConfirmClose
  /**
   * Cierra el modal sin guardar cambios (después de confirmación).
   */
  const handleConfirmClose = useCallback(() => {
    setShowConfirmClose(false);
    setPermissions(initialPermissions);
    setHasUnsavedChanges(false);
    onClose();
  }, [initialPermissions, onClose]);
  // #end-function

  // #function handleDeactivate
  /**
   * Da de baja el empleado tras confirmación.
   */
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
  /**
   * Retorna la etiqueta en español para un módulo.
   */
  const getModuleLabel = (module: string): string => {
    const labels: Record<string, string> = {
      products: 'Productos y Categorías',
      schedules: 'Horarios',
      socials: 'Redes Sociales',
    };
    return labels[module] || module;
  };
  // #end-function

  // #function getActionLabel
  /**
   * Retorna la etiqueta en español para una acción de permiso.
   */
  const getActionLabel = (action: PermissionAction): string => {
    const labels: Record<PermissionAction, string> = {
      canView: 'Ver',
      canEdit: 'Editar'
    };
    return labels[action];
  };
  // #end-function

  // #section Render - Confirmation Modal
  if (showConfirmClose) {
    return (
      <div className="modal-overlay" onClick={() => setShowConfirmClose(false)}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Cambios sin guardar</h2>
            <button 
              className="btn-close" 
              onClick={() => setShowConfirmClose(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <p style={{ marginBottom: '20px' }}>
              Tienes cambios sin guardar. ¿Deseas descartar los cambios y cerrar?
            </p>
          </div>
          <div className="modal-footer">
            <button
              className="button button-secondary"
              onClick={() => setShowConfirmClose(false)}
            >
              Seguir editando
            </button>
            <button
              className="button button-danger"
              onClick={handleConfirmClose}
            >
              Descartar cambios
            </button>
          </div>
        </div>
      </div>
    );
  }
  // #end-section

  // #section Render - Main Modal
  return (
    <div className="modal-overlay" onClick={handleCloseWithCheck}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* #section Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Permisos de Empleado
            {hasUnsavedChanges && <span style={{ color: '#ff6b6b', marginLeft: '8px' }}>*</span>}
          </h2>
          <button 
            className="btn-close" 
            onClick={handleCloseWithCheck}
            disabled={isSaving || isDeactivating}
          >
            ✕
          </button>
        </div>
        {/* #end-section */}

        {/* #section Content */}
        <div className="modal-body">
        <div className={styles.content}>
          {/* #subsection Load State */}
          {isLoadingPermissions && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Cargando permisos...</p>
            </div>
          )}
          {/* #end-subsection */}

          {/* #subsection Error State */}
          {loadError && (
            <ServerErrorBanner 
              message={`Error cargando permisos: ${loadError.message}`}
              onClose={() => {}}
            />
          )}
          {/* #end-subsection */}

          {/* #subsection Info */}
          {!isLoadingPermissions && !loadError && (
            <>
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

                <table className={styles.permissionsTable}>
                  <thead>
                    <tr>
                      <th className={styles.headerModule}>Módulo</th>
                      {ACTIONS.map(action => (
                        <th key={action}>{getActionLabel(action)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.values(EMPLOYEE_PERMISSION_MODULES) as string[]).map((module) => {
                      const moduleKey = module as keyof EmployeePermissions;
                      const modulePerms = (permissions[moduleKey] as ModulePermissions | undefined) || emptyModulePerms;

                      return (
                        <tr key={module}>
                          <td className={styles.moduleName}>{getModuleLabel(module)}</td>
                          {ACTIONS.map(action => (
                            <td key={action} className={styles.actionCell}>
                              <label className={styles.toggle}>
                                <input
                                  type="checkbox"
                                  checked={modulePerms[action] === true}
                                  onChange={(e) => handlePermissionChange(moduleKey, action, e.target.checked)}
                                  disabled={isSaving || isDeactivating || isLoadingPermissions}
                                />
                                <span>{getActionLabel(action)}</span>
                              </label>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* #end-subsection */}
            </>
          )}
        </div>
        </div>
        {/* #end-section */}

        {/* #section Footer */}
        <div className="modal-footer" style={{justifyContent: 'space-between'}}>
          <button
            className="button button-danger"
            onClick={handleDeactivate}
            disabled={isSaving || isDeactivating || !employee.isActive || isLoadingPermissions}
          >
            {isDeactivating ? 'Dando de baja...' : 'Dar de Baja'}
          </button>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <button
              className="button button-secondary"
              onClick={handleCloseWithCheck}
              disabled={isSaving || isDeactivating}
            >
              Cancelar
            </button>
            <button
              className="button button-primary"
              onClick={handleSave}
              disabled={isSaving || isDeactivating || isLoadingPermissions || !hasUnsavedChanges}
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

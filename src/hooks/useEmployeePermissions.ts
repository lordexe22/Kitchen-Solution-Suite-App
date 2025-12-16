import { useEffect, useState } from 'react';
import { httpClient } from '../api/httpClient.instance';
import type { EmployeePermissions } from '../config/permissions.config';

// #interface UseEmployeePermissionsState
interface UseEmployeePermissionsState {
  permissions: EmployeePermissions | null;
  loading: boolean;
  error: Error | null;
}
// #end-interface

// #function useEmployeePermissions
/**
 * Hook para cargar y gestionar los permisos de un empleado desde el servidor.
 * 
 * Se usa en el modal de permisos para obtener el estado actual de un empleado.
 * 
 * @param employeeId - ID del empleado cuyos permisos se cargarán
 * @returns Estado con permisos, carga y posible error
 * 
 * @example
 * const { permissions, loading, error } = useEmployeePermissions(employeeId);
 * if (loading) return <Spinner />;
 * if (error) return <ErrorBanner error={error} />;
 * return <PermissionsForm permissions={permissions} />;
 */
export function useEmployeePermissions(employeeId: string | null): UseEmployeePermissionsState {
  const [state, setState] = useState<UseEmployeePermissionsState>({
    permissions: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!employeeId) {
      setState({ permissions: null, loading: false, error: null });
      return;
    }

    const fetchPermissions = async () => {
      console.log(`[useEmployeePermissions] 🔄 Cargando permisos para empleado ID: ${employeeId}`);
      setState({ permissions: null, loading: true, error: null });

      try {
        const response = await httpClient.get<{ permissions: EmployeePermissions }>(
          `/employees/${employeeId}/permissions`,
        );
        console.log(`[useEmployeePermissions] ✅ Permisos cargados:`, response.permissions);
        setState({ permissions: response.permissions, loading: false, error: null });
      } catch (err) {
        console.error(`[useEmployeePermissions] ❌ Error cargando permisos:`, err);
        const error = err instanceof Error ? err : new Error('Error cargando permisos');
        setState({ permissions: null, loading: false, error });
      }
    };

    fetchPermissions();
  }, [employeeId]);

  return state;
}
// #end-function

// #function useUpdateEmployeePermissions
/**
 * Hook para actualizar los permisos de un empleado en el servidor.
 * 
 * Retorna una función que envía los permisos actualizados al backend.
 * 
 * @returns Función que acepta employeeId y permisos, y retorna Promise
 * 
 * @example
 * const updatePermissions = useUpdateEmployeePermissions();
 * const result = await updatePermissions(employeeId, newPermissions);
 * if (result.success) showSuccessMessage();
 */
export function useUpdateEmployeePermissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePermissions = async (
    employeeId: string,
    permissions: EmployeePermissions,
  ): Promise<{ success: boolean; error?: Error }> => {
    console.log(`[useUpdateEmployeePermissions] 🔄 Guardando permisos para empleado ID: ${employeeId}`, permissions);
    setLoading(true);
    setError(null);

    try {
      await httpClient.put(`/employees/${employeeId}/permissions`, {
        permissions,
      });

      console.log(`[useUpdateEmployeePermissions] ✅ Permisos guardados exitosamente`);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error(`[useUpdateEmployeePermissions] ❌ Error guardando permisos:`, err);
      const error = err instanceof Error ? err : new Error('Error actualizando permisos');
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  };

  return { updatePermissions, loading, error };
}
// #end-function

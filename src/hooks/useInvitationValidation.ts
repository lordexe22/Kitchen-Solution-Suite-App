/* src/hooks/useInvitationValidation.ts */

// #section Imports
import { useState, useEffect } from 'react';
import { validateInvitationToken } from '../services/invitations/invitations.services';
import type { InvitationValidationPayload } from '../services/invitations/invitations.types';
// #end-section

// #interface UseInvitationValidationReturn
interface UseInvitationValidationReturn {
  isLoading: boolean;
  isValid: boolean | null;
  data: InvitationValidationPayload | null;
  error: string | null;
}
// #end-interface

// #hook useInvitationValidation
/**
 * Hook para validar un token de invitación.
 * Ejecuta la validación automáticamente al montar el componente.
 * 
 * @param token - Token de invitación a validar
 * @returns Estado de la validación y datos de la invitación
 */
export const useInvitationValidation = (token: string | null): UseInvitationValidationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [data, setData] = useState<InvitationValidationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // #step 1 - Validar que existe token
    if (!token) {
      setIsLoading(false);
      setIsValid(false);
      setError('No se proporcionó un token de invitación');
      return;
    }

    console.log('[useInvitationValidation] Iniciando validación de token:', token.substring(0, 16) + '...');
    // #end-step

    // #step 2 - Validar token con el servidor
    const validateToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await validateInvitationToken(token);

        // El servidor responde con { success: boolean, valid: boolean, data?, error? }
        if (result.valid) {
          setIsValid(true);
          setData(result);
          console.log('[useInvitationValidation] ✓ token válido', {
            companyName: result.companyName,
            branchName: result.branchName,
            expiresAt: result.expiresAt,
            expiresIn: result.expiresIn
          });
        } else {
          setIsValid(false);
          setError(result.error || result.message || 'Token inválido');
          console.warn('[useInvitationValidation] Token inválido según servidor', {
            message: result.message,
            error: result.error
          });
        }
      } catch (err: unknown) {
        // Log pero NO de forma alarmante - esto es expected si no hay JWT
        const status = (err as { status?: number }).status;
        console.error('[useInvitationValidation] ✗ error al validar', {
          status,
          message: (err as { message?: string }).message
        });
        setIsValid(false);
        
        // Manejo de errores específicos
        const anyErr = err as { response?: { status?: number }, message?: string };
        if (anyErr?.response?.status === 400) {
          setError('Token inválido o expirado');
        } else if (anyErr?.response?.status === 401) {
          // 401 es esperado si no hay JWT, pero el request sigue siendo válido
          // porque /invitations/validate es público
          setError('Token inválido o expirado');
        } else {
          setError(anyErr?.message || 'Error al validar el token de invitación');
        }
      } finally {
        setIsLoading(false);
      }
    };
    // #end-step

    validateToken();
  }, [token]);

  return { isLoading, isValid, data, error };
};
// #end-hook


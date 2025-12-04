/* src/hooks/useAsyncOperation.ts */
// #section imports
import { useState, useCallback } from 'react';
// #end-section

// #interface UseAsyncOperationReturn
/**
 * Valor retornado por useAsyncOperation
 */
export interface UseAsyncOperationReturn {
  /** Indica si hay una operación en curso */
  isLoading: boolean;
  /** Mensaje de error si la operación falló */
  error: string | null;
  /** Ejecuta una operación asíncrona con manejo automático de loading/error */
  execute: <T>(operation: () => Promise<T>, errorMessage?: string) => Promise<T | null>;
  /** Limpia el error manualmente */
  clearError: () => void;
  /** Establece un error manualmente */
  setError: (error: string) => void;
}
// #end-interface

// #hook useAsyncOperation
/**
 * Hook genérico para manejar operaciones asíncronas con estado de loading y error.
 * 
 * Encapsula el patrón común de:
 * - Activar loading al iniciar
 * - Capturar y formatear errores
 * - Desactivar loading al finalizar (success o error)
 * - Logging de errores en consola
 * 
 * @template T - Tipo del resultado de la operación
 * @returns {UseAsyncOperationReturn<T>} Estado y función execute
 * 
 * @example
 * const { isLoading, error, execute } = useAsyncOperation<Company[]>();
 * 
 * const loadCompanies = async () => {
 *   const result = await execute(
 *     async () => await fetchCompanies(),
 *     'Error loading companies'
 *   );
 *   if (result) {
 *     setCompanies(result);
 *   }
 * };
 */
export function useAsyncOperation(): UseAsyncOperationReturn {
  // #state [isLoading, setIsLoading]
  const [isLoading, setIsLoading] = useState(false);
  // #end-state

  // #state [error, setError]
  const [error, setError] = useState<string | null>(null);
  // #end-state

  // #function clearError
  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  // #end-function

  // #function execute
  /**
   * Ejecuta una operación asíncrona con manejo automático de estado.
   * 
   * @template T - Tipo del resultado de la operación
   * @param operation - Función async que ejecuta la operación
   * @param errorMessage - Mensaje de error personalizado (default: 'Operation failed')
   * @returns Resultado de la operación o null si hubo error
   */
  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage = 'Operation failed'
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      // Extraer mensaje de error
      const msg = err instanceof Error ? err.message : errorMessage;
      setError(msg);
      console.error(errorMessage, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // #end-function

  return {
    isLoading,
    error,
    execute,
    clearError,
    setError
  };
}
// #end-hook

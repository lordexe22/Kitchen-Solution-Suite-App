/* src/api/httpClient.instance.ts */

// #section imports
import { HttpClient } from '../modules/httpClient';
import { createLogInterceptor, createErrorLogInterceptor } from '../modules/httpClient';
// #end-section

// #section config
/**
 * Configuración centralizada para el HttpClient.
 * Todos los valores se toman desde config.ts
 */
const API_BASE_URL = 'http://localhost:4000/api';
const API_TIMEOUT = 10000;
// #end-section

// #instance httpClient
/**
 * Instancia global de HttpClient para toda la aplicación.
 * 
 * Configuración:
 * - baseURL: http://localhost:4000/api
 * - timeout: 10 segundos
 * - withCredentials: true (envía cookies HTTP-only)
 * - retry: true (3 reintentos automáticos)
 * 
 * @example
 * import { httpClient } from '@/api/httpClient.instance';
 * 
 * // GET request
 * const users = await httpClient.get<User[]>('/users');
 * 
 * // POST request
 * const newUser = await httpClient.post<User>('/users', { name: 'Juan' });
 */
export const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  retry: true,
  maxRetries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
// #end-instance

// #section interceptors
/**
 * Interceptores configurados para desarrollo.
 * 
 * - Log interceptor: Muestra en consola todas las requests
 * - Error log interceptor: Muestra en consola todos los errores
 * 
 * NOTA: En producción podrías desactivar el log interceptor
 * o agregar uno que envíe errores a un servicio de monitoring.
 */
if (import.meta.env.DEV) {
  // Solo en desarrollo: log de requests
  httpClient.addRequestInterceptor(createLogInterceptor());
  
  // Log de errores (útil en desarrollo y producción)
  httpClient.addErrorInterceptor(createErrorLogInterceptor());
}
// #end-section
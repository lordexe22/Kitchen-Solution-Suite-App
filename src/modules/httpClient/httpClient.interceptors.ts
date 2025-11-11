/* src/modules/httpClient/httpClient.interceptors.ts */

// #section Imports
import type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './httpClient.types';
// #end-section

// #function createAuthInterceptor
/**
 * Crea un interceptor que agrega token de autenticación automáticamente.
 * 
 * @param getToken - Función que retorna el token actual (o null si no hay)
 * @returns Interceptor de request configurado
 * 
 * @example
 * httpClient.addRequestInterceptor(
 *   createAuthInterceptor(() => localStorage.getItem('auth_token'))
 * );
 */
export const createAuthInterceptor = (
  getToken: () => string | null
): RequestInterceptor => {
  return (config) => {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  };
};
// #end-function

// #function createLogInterceptor
/**
 * Crea un interceptor que loguea todas las peticiones.
 * Útil para debugging en desarrollo.
 * 
 * @param logger - Función para loguear (default: console.log)
 * @returns Interceptor de request configurado
 * 
 * @example
 * httpClient.addRequestInterceptor(
 *   createLogInterceptor((msg) => console.log(`[API] ${msg}`))
 * );
 */
export const createLogInterceptor = (
  logger: (message: string) => void = console.log
): RequestInterceptor => {
  return (config) => {
    logger(`🚀 ${config.method || 'GET'} ${config.url}`);
    return config;
  };
};
// #end-function

// #function createResponseLogInterceptor
/**
 * Crea un interceptor que loguea las respuestas exitosas.
 * 
 * @param logger - Función para loguear (default: console.log)
 * @returns Interceptor de response configurado
 * 
 * @example
 * httpClient.addResponseInterceptor(
 *   createResponseLogInterceptor()
 * );
 */
export const createResponseLogInterceptor = (
  logger: (message: string) => void = console.log
): ResponseInterceptor => {
  return (response) => {
    logger(`✅ ${response.status} ${response.statusText}`);
    return response;
  };
};
// #end-function

// #function createErrorLogInterceptor
/**
 * Crea un interceptor que loguea los errores.
 * 
 * @param logger - Función para loguear (default: console.error)
 * @returns Interceptor de error configurado
 * 
 * @example
 * httpClient.addErrorInterceptor(
 *   createErrorLogInterceptor()
 * );
 */
export const createErrorLogInterceptor = (
  logger: (message: string) => void = console.error
): ErrorInterceptor => {
  return (error) => {
    logger(`❌ Error: ${error.message}`);
    throw error;
  };
};
// #end-function
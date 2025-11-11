/* src/modules/httpClient/httpClient.types.ts */

// #type HttpMethod
/**
 * Métodos HTTP soportados por el cliente.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// #end-type

// #interface RequestConfig
/**
 * Configuración para una petición HTTP individual.
 * Sobrescribe la configuración global del cliente.
 */
export interface RequestConfig {
  /** URL completa o path relativo (se concatenará con baseURL) */
  url: string;
  /** Método HTTP (default: GET) */
  method?: HttpMethod;
  /** Headers personalizados para esta petición */
  headers?: Record<string, string>;
  /** Body de la petición (se serializará automáticamente) */
  data?: unknown;
  /** Query parameters (?key=value) */
  params?: Record<string, string | number | boolean>;
  /** Timeout en milisegundos (sobrescribe el global) */
  timeout?: number;
  /** Si debe incluir credentials/cookies (sobrescribe el global) */
  withCredentials?: boolean;
  /** Si debe hacer retry en caso de error (sobrescribe el global) */
  retry?: boolean;
  /** Número máximo de reintentos (sobrescribe el global) */
  maxRetries?: number;
  /** Delay entre reintentos en ms (sobrescribe el global) */
  retryDelay?: number;
}
// #end-interface

// #interface ApiResponse
/**
 * Respuesta HTTP estandarizada del backend.
 * Este es el formato que el backend debe devolver.
 */
export interface ApiResponse<T> {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Datos de la respuesta (presente si success=true) */
  data?: T;
  /** Mensaje de error (presente si success=false) */
  error?: string;
  /** Mensaje adicional opcional */
  message?: string;
}
// #end-interface

// #interface HttpResponse
/**
 * Respuesta procesada del cliente HTTP.
 * Es lo que retornan los métodos get, post, put, delete, patch.
 */
export interface HttpResponse<T> {
  /** Datos extraídos del response.data */
  data: T;
  /** Status code HTTP (200, 404, 500, etc.) */
  status: number;
  /** Texto del status (OK, Not Found, etc.) */
  statusText: string;
  /** Headers de la respuesta */
  headers: Headers;
}
// #end-interface

// #interface HttpClientConfig
/**
 * Configuración global del HttpClient.
 * Se establece al instanciar el cliente.
 */
export interface HttpClientConfig {
  /** URL base para todas las peticiones */
  baseURL: string;
  /** Timeout por defecto en milisegundos */
  timeout?: number;
  /** Headers por defecto para todas las peticiones */
  headers?: Record<string, string>;
  /** Si debe incluir credentials/cookies por defecto */
  withCredentials?: boolean;
  /** Si debe hacer retry por defecto */
  retry?: boolean;
  /** Máximo de reintentos por defecto */
  maxRetries?: number;
  /** Delay entre reintentos por defecto (ms) */
  retryDelay?: number;
}
// #end-interface

// #type RequestInterceptor
/**
 * Interceptor que se ejecuta ANTES de enviar la petición.
 * Puede modificar la configuración o ejecutar lógica adicional.
 * 
 * @param config - Configuración de la petición
 * @returns Configuración modificada o promesa de configuración
 */
export type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;
// #end-type

// #type ResponseInterceptor
/**
 * Interceptor que se ejecuta DESPUÉS de recibir la respuesta.
 * Puede modificar la respuesta o ejecutar lógica adicional.
 * 
 * @param response - Respuesta HTTP procesada
 * @returns Respuesta modificada o promesa de respuesta
 */
export type ResponseInterceptor = <T>(
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>;
// #end-type

// #type ErrorInterceptor
/**
 * Interceptor que se ejecuta CUANDO hay un error.
 * Puede manejar el error o re-lanzarlo.
 * 
 * @param error - Error capturado
 * @returns Nunca retorna (siempre lanza error)
 */
export type ErrorInterceptor = (
  error: Error
) => never | Promise<never>;
// #end-type
/* src/modules/httpClient/httpClient.config.ts */

// #section Imports
import type { HttpClientConfig } from './httpClient.types';
// #end-section

// #config DEFAULT_HTTP_CONFIG
/**
 * Configuración por defecto del HttpClient.
 * Puede ser sobrescrita al instanciar el cliente.
 * 
 * NOTA: baseURL debe ser configurado por el proyecto que use este módulo.
 * El valor aquí es solo un fallback.
 */
export const DEFAULT_HTTP_CONFIG: HttpClientConfig = {
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  withCredentials: true,
  retry: true,
  maxRetries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
// #end-config

// #config RETRYABLE_STATUS_CODES
/**
 * Códigos HTTP que deben reintentar automáticamente.
 * 
 * - 408: Request Timeout
 * - 429: Too Many Requests
 * - 500: Internal Server Error
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - 504: Gateway Timeout
 */
export const RETRYABLE_STATUS_CODES: readonly number[] = [408, 429, 500, 502, 503, 504];
// #end-config

// #config HTTP_STATUS_MESSAGES
/**
 * Mensajes por defecto para cada código HTTP.
 * Se usan cuando el servidor no devuelve un mensaje de error.
 */
export const HTTP_STATUS_MESSAGES: Readonly<Record<number, string>> = {
  400: 'Solicitud inválida',
  401: 'No autenticado',
  403: 'Sin permisos',
  404: 'Recurso no encontrado',
  408: 'Tiempo de espera agotado',
  429: 'Demasiadas solicitudes',
  500: 'Error del servidor',
  502: 'Puerta de enlace incorrecta',
  503: 'Servicio no disponible',
  504: 'Tiempo de espera de puerta de enlace',
};
// #end-config
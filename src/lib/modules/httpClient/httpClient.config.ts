import type { HttpClientConfig } from './httpClient.types';

export const DEFAULT_HTTP_CONFIG: HttpClientConfig = {
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  withCredentials: true,
  retry: {
    maxRetries: 3,
    delay: 1000,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const RETRYABLE_STATUS_CODES: readonly number[] = [408, 429, 500, 502, 503, 504];

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

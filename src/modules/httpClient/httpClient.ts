/* src/modules/httpClient/httpClient.ts */

// #section Imports
import type {
  RequestConfig,
  ApiResponse,
  HttpResponse,
  HttpClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './httpClient.types';
import { DEFAULT_HTTP_CONFIG, RETRYABLE_STATUS_CODES, HTTP_STATUS_MESSAGES } from './httpClient.config';
import { createHttpError } from './httpClient.errors';
// #end-section

// #class HttpClient
/**
 * Cliente HTTP centralizado con soporte para:
 * - Interceptores (request, response, error)
 * - Reintentos automáticos
 * - Manejo de errores tipado
 * - Configuración flexible
 * - 100% autónomo (sin dependencias externas del proyecto)
 * 
 * @example
 * const client = new HttpClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000
 * });
 * 
 * const users = await client.get<User[]>('/users');
 */
export class HttpClient {
  private readonly config: HttpClientConfig;
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];

  // #constructor
  /**
   * Crea una nueva instancia de HttpClient.
   * 
   * @param config - Configuración personalizada (se mergea con la default)
   */
  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_HTTP_CONFIG, ...config };
  }
  // #end-constructor

  // ========================================
  // MÉTODOS PÚBLICOS - API
  // ========================================

  // #function get
  /**
   * Realiza una petición GET.
   * 
   * @template T - Tipo de datos esperado en la respuesta
   * @param url - URL o path relativo
   * @param config - Configuración adicional (opcional)
   * @returns Promise con los datos tipados
   */
  async get<T>(url: string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }
  // #end-function

  // #function post
  /**
   * Realiza una petición POST.
   * 
   * @template T - Tipo de datos esperado en la respuesta
   * @param url - URL o path relativo
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional (opcional)
   * @returns Promise con los datos tipados
   */
  async post<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }
  // #end-function

  // #function put
  /**
   * Realiza una petición PUT.
   * 
   * @template T - Tipo de datos esperado en la respuesta
   * @param url - URL o path relativo
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional (opcional)
   * @returns Promise con los datos tipados
   */
  async put<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }
  // #end-function

  // #function patch
  /**
   * Realiza una petición PATCH.
   * 
   * @template T - Tipo de datos esperado en la respuesta
   * @param url - URL o path relativo
   * @param data - Datos a enviar en el body
   * @param config - Configuración adicional (opcional)
   * @returns Promise con los datos tipados
   */
  async patch<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }
  // #end-function

  // #function delete
  /**
   * Realiza una petición DELETE.
   * 
   * @template T - Tipo de datos esperado en la respuesta
   * @param url - URL o path relativo
   * @param config - Configuración adicional (opcional)
   * @returns Promise con los datos tipados
   */
  async delete<T>(url: string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }
  // #end-function

  // ========================================
  // GESTIÓN DE INTERCEPTORES
  // ========================================

  // #function addRequestInterceptor
  /**
   * Agrega un interceptor de request.
   * Se ejecuta ANTES de enviar la petición.
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }
  // #end-function

  // #function addResponseInterceptor
  /**
   * Agrega un interceptor de response.
   * Se ejecuta DESPUÉS de recibir la respuesta exitosa.
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }
  // #end-function

  // #function addErrorInterceptor
  /**
   * Agrega un interceptor de errores.
   * Se ejecuta CUANDO hay un error en la petición.
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }
  // #end-function

  // Continúa en Parte 2...

  // ... continuación de httpClient.ts

  // ========================================
  // MÉTODOS PRIVADOS INTERNOS
  // ========================================

  // #function request
  /**
   * Método principal que orquesta toda la petición HTTP.
   * Ejecuta interceptores, maneja errores, reintentos, etc.
   */
  private async request<T>(config: RequestConfig): Promise<T> {
    try {
      // 1. Mergear configuración
      const mergedConfig = this.mergeConfig(config);

      // 2. Ejecutar interceptores de request
      const processedConfig = await this.runRequestInterceptors(mergedConfig);

      // 3. Hacer la petición (con retry si está habilitado)
      let response: HttpResponse<T>;
      
      if (processedConfig.retry) {
        response = await this.requestWithRetry<T>(processedConfig);
      } else {
        response = await this.executeRequest<T>(processedConfig);
      }

      // 4. Ejecutar interceptores de response
      const processedResponse = await this.runResponseInterceptors(response);

      // 5. Retornar datos
      return processedResponse.data;

    } catch (error) {
      // 6. Ejecutar interceptores de error
      await this.runErrorInterceptors(error as Error);
      
      // 7. Re-lanzar el error
      throw error;
    }
  }
  // #end-function

  // #function mergeConfig
  /**
   * Mergea la configuración individual con la global.
   */
  private mergeConfig(config: RequestConfig): Required<RequestConfig> {
    return {
      url: config.url,
      method: config.method || 'GET',
      timeout: config.timeout ?? this.config.timeout ?? 10000,
      withCredentials: config.withCredentials ?? this.config.withCredentials ?? true,
      retry: config.retry ?? this.config.retry ?? true,
      maxRetries: config.maxRetries ?? this.config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? this.config.retryDelay ?? 1000,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
      data: config.data,
      params: config.params ?? {},
    };
  }
  // #end-function

  // #function executeRequest
  /**
   * Ejecuta la petición HTTP real usando fetch con timeout.
   * Implementa fetchWithTimeout internamente para ser 100% autónomo.
   */
  private async executeRequest<T>(config: Required<RequestConfig>): Promise<HttpResponse<T>> {
    // Construir URL completa
    const url = this.buildURL(config.url, config.params);

    // Preparar opciones de fetch
    const fetchOptions: RequestInit = {
      method: config.method,
      headers: config.headers as HeadersInit,
      credentials: config.withCredentials ? 'include' : 'omit',
    };

    // Agregar body si existe (excepto en GET)
    if (config.data !== undefined && config.method !== 'GET') {
      fetchOptions.body = JSON.stringify(config.data);
    }

    try {
      // Hacer petición con timeout (implementación interna)
      const response = await this.fetchWithTimeout(url, fetchOptions, config.timeout);

      // Parsear respuesta
      const contentType = response.headers.get('content-type');
      let responseData: unknown;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorMessage = this.extractErrorMessage(responseData, response.status);
        throw createHttpError(response.status, errorMessage, responseData);
      }

      // Verificar formato ApiResponse
      if (this.isApiResponse<T>(responseData)) {
        if (!responseData.success) {
          const errorMessage = responseData.error || responseData.message || 'Request failed';
          throw createHttpError(response.status, errorMessage, responseData);
        }

        // Retornar datos del ApiResponse
        return {
          data: responseData.data as T,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      }

      // Si no es ApiResponse, retornar tal cual
      return {
        data: responseData as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

    } catch (error) {
      // Si ya es un HttpError, re-lanzarlo
      if (error instanceof Error && error.name.includes('Error')) {
        throw error;
      }

      // Si es un error de red (fetch falló)
      throw createHttpError(0, 'Error de conexión. Verifica tu internet.');
    }
  }
  // #end-function

  // #function fetchWithTimeout
  /**
   * Implementación interna de fetch con timeout.
   * Hace al módulo 100% autónomo sin depender de utils externos.
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw createHttpError(408, 'Timeout: la petición tardó demasiado');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  // #end-function

  // #function requestWithRetry
  /**
   * Ejecuta la petición con lógica de reintentos.
   */
  private async requestWithRetry<T>(config: Required<RequestConfig>): Promise<HttpResponse<T>> {
    const maxRetries = config.maxRetries;
    const retryDelay = config.retryDelay;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(config);
      } catch (error) {
        lastError = error as Error;

        // Verificar si el error es retryable
        const isRetryable = this.isRetryableError(error as Error);
        const isLastAttempt = attempt === maxRetries;

        if (!isRetryable || isLastAttempt) {
          throw error;
        }

        // Esperar antes de reintentar (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    // Si llegamos aquí, lanzar el último error
    throw lastError;
  }
  // #end-function

  // Continúa en Parte 3...

  // ... continuación de httpClient.ts

  // #function isRetryableError
  /**
   * Verifica si un error es retryable.
   */
  private isRetryableError(error: Error): boolean {
    // Errores de red siempre son retryables
    if (error.name === 'NetworkError') {
      return true;
    }

    // Verificar status code si es HttpError
    if ('status' in error && typeof (error as { status: unknown }).status === 'number') {
      const status = (error as { status: number }).status;
      return RETRYABLE_STATUS_CODES.includes(status);
    }

    return false;
  }
  // #end-function

  // #function buildURL
  /**
   * Construye la URL completa concatenando baseURL + url + params.
   */
  private buildURL(
    url: string, 
    params?: Record<string, string | number | boolean>
  ): string {
    // Si es URL absoluta, usarla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return this.appendParams(url, params);
    }

    // Construir URL relativa
    const baseURL = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;

    const path = url.startsWith('/') ? url : `/${url}`;
    const fullURL = `${baseURL}${path}`;

    return this.appendParams(fullURL, params);
  }
  // #end-function

  // #function appendParams
  /**
   * Agrega query params a la URL.
   */
  private appendParams(
    url: string,
    params?: Record<string, string | number | boolean>
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${searchParams.toString()}`;
  }
  // #end-function

  // #function extractErrorMessage
  /**
   * Extrae el mensaje de error de la respuesta.
   */
  private extractErrorMessage(responseData: unknown, status: number): string {
    // Intentar extraer mensaje del responseData
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;
      
      if (typeof data.error === 'string') {
        return data.error;
      }
      
      if (typeof data.message === 'string') {
        return data.message;
      }
    }

    // Usar mensaje por defecto según status code
    return HTTP_STATUS_MESSAGES[status] || 'Error en la petición';
  }
  // #end-function

  // #function isApiResponse
  /**
   * Type guard para verificar si responseData es un ApiResponse.
   */
  private isApiResponse<T>(data: unknown): data is ApiResponse<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'success' in data &&
      typeof (data as Record<string, unknown>).success === 'boolean'
    );
  }
  // #end-function

  // #function runRequestInterceptors
  /**
   * Ejecuta todos los interceptores de request en orden.
   */
  private async runRequestInterceptors(config: Required<RequestConfig>): Promise<Required<RequestConfig>> {
    let processedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig) as Required<RequestConfig>;
    }

    return processedConfig;
  }
  // #end-function

  // #function runResponseInterceptors
  /**
   * Ejecuta todos los interceptores de response en orden.
   */
  private async runResponseInterceptors<T>(response: HttpResponse<T>): Promise<HttpResponse<T>> {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  }
  // #end-function

  // #function runErrorInterceptors
  /**
   * Ejecuta todos los interceptores de error en orden.
   */
  private async runErrorInterceptors(error: Error): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
  }
  // #end-function

  // #function sleep
  /**
   * Utilidad para esperar X milisegundos.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // #end-function
}
// #end-class
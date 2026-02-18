/* src/modules/httpClient/httpClient.ts */

import type {
  RequestConfig,
  HttpResponse,
  HttpClientConfig,
  ApiResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './index';
import { DEFAULT_HTTP_CONFIG, RETRYABLE_STATUS_CODES, HTTP_STATUS_MESSAGES } from './httpClient.config';
import { createHttpError } from './index';

export class HttpClient {
  private readonly config: HttpClientConfig;
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_HTTP_CONFIG, ...config };
  }

  // ========================================
  // MÉTODOS PÚBLICOS - API
  // ========================================

  async get<T>(url: string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  async put<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  async patch<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }

  async delete<T>(url: string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  // ========================================
  // GESTIÓN DE INTERCEPTORES
  // ========================================

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // ========================================
  // MÉTODOS PRIVADOS INTERNOS
  // ========================================

  private async request<T>(config: RequestConfig): Promise<T> {
    try {
      const mergedConfig = this.mergeConfig(config);
      const processedConfig = await this.runRequestInterceptors(mergedConfig);

      let response: HttpResponse<T>;
      if (processedConfig.retry) {
        response = await this.requestWithRetry<T>(processedConfig);
      } else {
        response = await this.executeRequest<T>(processedConfig);
      }

      const processedResponse = await this.runResponseInterceptors(response);
      return processedResponse.data;
    } catch (error) {
      await this.runErrorInterceptors(error as Error);
      throw error;
    }
  }

  private mergeConfig(config: RequestConfig): Required<RequestConfig> {
    const defaultRetry = { maxRetries: 3, delay: 1000 };
    return {
      url: config.url,
      method: config.method || 'GET',
      timeout: config.timeout ?? this.config.timeout ?? 10000,
      withCredentials: config.withCredentials ?? this.config.withCredentials ?? true,
      retry: config.retry ?? this.config.retry ?? defaultRetry,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
      data: config.data,
      params: config.params ?? {},
    };
  }

  /**
   * Ejecuta la petición HTTP real usando fetch con timeout.
   */
  private async executeRequest<T>(config: Required<RequestConfig>): Promise<HttpResponse<T>> {
    const url = this.buildURL(config.url, config.params);

    const fetchOptions: RequestInit = {
      method: config.method,
      headers: config.headers as HeadersInit,
      credentials: config.withCredentials ? 'include' : 'omit',
    };

    if (config.data !== undefined && config.method !== 'GET') {
      if (config.data instanceof FormData) {
        fetchOptions.body = config.data;
        // Eliminar Content-Type para que el navegador establezca el boundary correcto
        const headers = fetchOptions.headers as Record<string, string>;
        delete headers['Content-Type'];
      } else {
        fetchOptions.body = JSON.stringify(config.data);
      }
    }

    try {
      const response = await this.fetchWithTimeout(url, fetchOptions, config.timeout);

      const contentType = response.headers.get('content-type');
      let responseData: unknown;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorMessage = this.extractErrorMessage(responseData, response.status);
        throw createHttpError(response.status, errorMessage, responseData);
      }

      if (this.isApiResponse<T>(responseData)) {
        if (!responseData.success) {
          const errorMessage = responseData.error || responseData.message || 'Request failed';
          throw createHttpError(response.status, errorMessage, responseData);
        }

        return {
          data: responseData.data as T,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      }

      return {
        data: responseData as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof Error && error.name.includes('Error')) {
        throw error;
      }
      throw createHttpError(0, 'Error de conexión. Verifica tu internet.');
    }
  }

  /**
   * Implementación interna de fetch con timeout.
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

  /**
   * Ejecuta la petición con lógica de reintentos.
   */
  private async requestWithRetry<T>(config: Required<RequestConfig>): Promise<HttpResponse<T>> {
    const maxRetries = config.retry?.maxRetries ?? 3;
    const retryDelay = config.retry?.delay ?? 1000;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest<T>(config);
      } catch (error) {
        lastError = error as Error;

        const isRetryable = this.isRetryableError(error as Error);
        const isLastAttempt = attempt === maxRetries;

        if (!isRetryable || isLastAttempt) {
          throw error;
        }

        const delay = retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Verifica si un error es retryable.
   */
  private isRetryableError(error: Error): boolean {
    if (error.name === 'NetworkError') {
      return true;
    }

    if ('status' in error && typeof (error as { status: unknown }).status === 'number') {
      const status = (error as { status: number }).status;
      return RETRYABLE_STATUS_CODES.includes(status);
    }

    return false;
  }

  /**
   * Construye la URL completa concatenando baseURL + url + params.
   */
  private buildURL(
    url: string,
    params?: Record<string, string | number | boolean>
  ): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return this.appendParams(url, params);
    }

    const baseURL = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;

    const path = url.startsWith('/') ? url : `/${url}`;
    const fullURL = `${baseURL}${path}`;

    return this.appendParams(fullURL, params);
  }

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

  /**
   * Extrae el mensaje de error de la respuesta.
   */
  private extractErrorMessage(responseData: unknown, status: number): string {
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;

      if (typeof data.error === 'string') {
        return data.error;
      }

      if (typeof data.message === 'string') {
        return data.message;
      }
    }

    return HTTP_STATUS_MESSAGES[status] || 'Error en la petición';
  }

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

  /**
   * Ejecuta todos los interceptores de error en orden.
   */
  private async runErrorInterceptors(error: Error): Promise<void> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
  }

  /**
   * Utilidad para esperar X milisegundos.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

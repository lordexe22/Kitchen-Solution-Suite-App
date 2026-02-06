/* src/modules/httpClient/httpClient.ts */

import type {
  RequestConfig,
  HttpResponse,
  HttpClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './index';
import { DEFAULT_HTTP_CONFIG } from './index';

export class HttpClient {
  private readonly config: HttpClientConfig;
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_HTTP_CONFIG, ...config };
  }

  async get<T>(url: string, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  async put<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  async patch<T>(url: string, data?: unknown, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }

  async delete<T>(url: string, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

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
  // Internos
  // ========================================

  private async request<T>(config: RequestConfig): Promise<HttpResponse<T>> {
    try {
      const mergedConfig = this.mergeConfig(config);
      const processedConfig = await this._runRequestInterceptors(mergedConfig);

      let response: HttpResponse<T>;
      if (processedConfig.retry) {
        response = await this._requestWithRetry<T>();
      } else {
        response = await this._executeRequest<T>();
      }

      const processedResponse = await this._runResponseInterceptors(response);
      return processedResponse;
    } catch (error) {
      await this._runErrorInterceptors(error as Error);
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

  private async _executeRequest<T>(/* config: Required<RequestConfig> */): Promise<HttpResponse<T>> {
    // ...existing code...
    throw new Error('Método no implementado');
  }
    private _runRequestInterceptors(config: Required<RequestConfig>): Promise<Required<RequestConfig>> {
      // Aquí puedes tipar y procesar los interceptores correctamente
      return Promise.resolve(config);
    }
    private _runResponseInterceptors<T>(response: HttpResponse<T>): Promise<HttpResponse<T>> {
      // Aquí puedes tipar y procesar los interceptores correctamente
      return Promise.resolve(response);
    }
    private _runErrorInterceptors(error: Error): Promise<Error> {
      // Aquí puedes tipar y procesar los interceptores correctamente
      return Promise.resolve(error);
    }
    // private _buildURL(url: string, params?: Record<string, string | number | boolean>): string {
    //   // Implementación básica para evitar error
    //   if (!params || Object.keys(params).length === 0) return url;
    //   const query = Object.entries(params)
    //     .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    //     .join('&');
    //   return `${url}?${query}`;
    // }
    private async _requestWithRetry<T>(/* config: Required<RequestConfig> */): Promise<HttpResponse<T>> {
      // Implementación básica para evitar error
      return this._executeRequest<T>();
    }
  // ...existing code...
}

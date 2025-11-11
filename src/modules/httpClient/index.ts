/* src/modules/httpClient/index.ts */

// #section Exports - Main Class
export { HttpClient } from './httpClient';
// #end-section

// #section Exports - Types
export type { 
  HttpMethod,
  RequestConfig,
  ApiResponse,
  HttpResponse,
  HttpClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from './httpClient.types';
// #end-section

// #section Exports - Errors
export {
  HttpError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
  createHttpError
} from './httpClient.errors';
// #end-section

// #section Exports - Interceptors
export {
  createAuthInterceptor,
  createLogInterceptor,
  createResponseLogInterceptor,
  createErrorLogInterceptor
} from './httpClient.interceptors';
// #end-section

// #section Exports - Config
export { DEFAULT_HTTP_CONFIG } from './httpClient.config';
// #end-section
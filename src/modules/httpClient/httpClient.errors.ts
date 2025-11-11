/* src/modules/httpClient/httpClient.errors.ts */

// #class HttpError
/**
 * Error base para todas las peticiones HTTP.
 * Todos los errores HTTP específicos heredan de esta clase.
 */
export class HttpError extends Error {
  name: string;
  status: number;
  statusText: string;
  response?: unknown;

  constructor(
    message: string,
    status: number,
    statusText: string,
    response?: unknown
  ) {
    super(message);
    
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    
    // Mantiene stack trace correcto en V8 (solo en navegadores compatibles)
    const ErrorConstructor = Error as unknown as {
      captureStackTrace?: (thisArg: unknown, constructorOpt: unknown) => void;
    };
    
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, HttpError);
    }

    // Necesario para instanceof en TypeScript cuando se extiende Error
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  /**
   * Convierte el error a formato JSON para logging.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      response: this.response,
    };
  }
}
// #end-class

// #class NetworkError
/**
 * Error de red (sin conexión, timeout, DNS failure, etc.)
 * Status 0 indica que no hubo respuesta del servidor.
 */
export class NetworkError extends HttpError {
  constructor(message: string = 'Error de conexión. Verifica tu internet.') {
    super(message, 0, 'Network Error');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
// #end-class

// #class ValidationError
/**
 * Error de validación (400 Bad Request)
 * El servidor rechazó la petición por datos inválidos.
 */
export class ValidationError extends HttpError {
  constructor(message: string, response?: unknown) {
    super(message, 400, 'Bad Request', response);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
// #end-class

// #class AuthenticationError
/**
 * Error de autenticación (401 Unauthorized)
 * El usuario no está autenticado o el token es inválido.
 */
export class AuthenticationError extends HttpError {
  constructor(message: string = 'No estás autenticado. Inicia sesión.') {
    super(message, 401, 'Unauthorized');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
// #end-class

// #class AuthorizationError
/**
 * Error de autorización (403 Forbidden)
 * El usuario está autenticado pero no tiene permisos para esta acción.
 */
export class AuthorizationError extends HttpError {
  constructor(message: string = 'No tienes permisos para esta acción.') {
    super(message, 403, 'Forbidden');
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
// #end-class

// #class NotFoundError
/**
 * Recurso no encontrado (404 Not Found)
 * El endpoint o recurso solicitado no existe.
 */
export class NotFoundError extends HttpError {
  constructor(message: string = 'Recurso no encontrado.') {
    super(message, 404, 'Not Found');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
// #end-class

// #class ServerError
/**
 * Error del servidor (5xx)
 * Problemas internos del backend.
 */
export class ServerError extends HttpError {
  constructor(message: string = 'Error del servidor. Intenta más tarde.', status: number = 500) {
    super(message, status, 'Server Error');
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
// #end-class

// #function createHttpError
/**
 * Factory que crea el error apropiado según el status code.
 * Simplifica la creación de errores tipados.
 * 
 * @param status - Código HTTP del error
 * @param message - Mensaje descriptivo del error
 * @param response - Respuesta completa del servidor (opcional)
 * @returns Instancia del error apropiado
 */
export const createHttpError = (
  status: number, 
  message: string, 
  response?: unknown
): HttpError => {
  switch (status) {
    case 0:
      return new NetworkError(message);
    case 400:
      return new ValidationError(message, response);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, status);
    default:
      return new HttpError(message, status, 'HTTP Error', response);
  }
};
// #end-function
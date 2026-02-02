export class HttpError extends Error {
  name: string;
  status: number;
  statusText: string;
  response?: unknown;

  constructor(message: string, status: number, statusText: string, response?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;

    const ErrorConstructor = Error as unknown as { captureStackTrace?: (thisArg: unknown, constructorOpt: unknown) => void };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, HttpError);
    }
    Object.setPrototypeOf(this, HttpError.prototype);
  }

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

export class NetworkError extends HttpError {
  constructor(message: string = 'Error de conexión. Verifica tu internet.') {
    super(message, 0, 'Network Error');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, response?: unknown) {
    super(message, 400, 'Bad Request', response);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string = 'No estás autenticado. Inicia sesión.') {
    super(message, 401, 'Unauthorized');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends HttpError {
  constructor(message: string = 'No tienes permisos para esta acción.') {
    super(message, 403, 'Forbidden');
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Recurso no encontrado.') {
    super(message, 404, 'Not Found');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ServerError extends HttpError {
  constructor(message: string = 'Error del servidor. Intenta más tarde.', status: number = 500) {
    super(message, status, 'Server Error');
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export const createHttpError = (status: number, message: string, response?: unknown): HttpError => {
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

// src/utils/detectServerError.ts

export type ServerErrorType = 
  | 'network'    // Sin conexión
  | 'timeout'    // Timeout
  | 'server'     // Error 500+
  | 'unknown';   // Otros

interface ErrorWithStatus {
  status?: number;
  name?: string;
  message?: string;
}

export const detectServerErrorType = (error: unknown): ServerErrorType => {
  // Error de red (sin conexión)
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    if (
      message.includes('fetch') || 
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('network error') ||
      message.includes('load failed')
    ) {
      return 'network';
    }
  }

  // Timeout
  if (error instanceof Error && 
      (error.name === 'AbortError' || error.message.includes('timeout'))) {
    return 'timeout';
  }

  // Error 500+ del servidor
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as ErrorWithStatus;
    if (errorObj.status && errorObj.status >= 500) {
      return 'server';
    }
  }

  return 'unknown';
};

export const getServerErrorMessage = (errorType: ServerErrorType): string => {
  const messages = {
    network: 'Unable to connect to the server. Please check your internet connection and try again.',
    timeout: 'The server is taking too long to respond. Please try again later.',
    server: 'The server encountered an error. Please try again later.',
    unknown: 'Something went wrong. Please try again later.'
  };

  return messages[errorType];
};
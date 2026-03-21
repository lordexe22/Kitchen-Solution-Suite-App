// src/utils/detectServerError/detectServerError.ts

import type { ServerErrorType, ErrorWithStatus } from './detectServerError.types';

// #function detectServerErrorType - Clasifica el tipo de error de servidor según su origen técnico
/**
 * @description Analiza un error desconocido y determina su categoría de origen.
 * @purpose Proveer una clasificación uniforme de errores que permita a los consumidores responder de forma diferenciada.
 * @context Utilizado por componentes de autenticación y cualquier flujo que realice llamadas al servidor.
 * @param error error capturado en un bloque catch cuyo origen se desconoce
 * @returns categoría del error según su naturaleza técnica
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
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
// #end-function

// #function getServerErrorMessage - Obtiene el mensaje de error legible según el tipo de error
/**
 * @description Retorna un mensaje descriptivo en inglés correspondiente al tipo de error recibido.
 * @purpose Centralizar los mensajes de error de servidor para garantizar consistencia en la UI.
 * @context Utilizado por componentes de autenticación tras clasificar el error con detectServerErrorType.
 * @param errorType categoría del error previamente clasificada
 * @returns mensaje descriptivo listo para mostrar al usuario
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const getServerErrorMessage = (errorType: ServerErrorType): string => {
  const messages = {
    network: 'Unable to connect to the server. Please check your internet connection and try again.',
    timeout: 'The server is taking too long to respond. Please try again later.',
    server: 'The server encountered an error. Please try again later.',
    unknown: 'Something went wrong. Please try again later.'
  };

  return messages[errorType];
};
// #end-function
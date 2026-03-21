/* src/utils/detectServerError/detectServerError.types.ts */
// #type ServerErrorType - Categorías de error del servidor clasificadas por origen
/**
 * @description Clasificación de los tipos de error de servidor según su origen técnico.
 * @purpose Permitir una gestión diferenciada de errores según su naturaleza en los consumidores.
 * @context Utilizado por detectServerErrorType y getServerErrorMessage dentro del módulo detectServerError.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export type ServerErrorType =
  | 'network'   // Sin conexión
  | 'timeout'   // Timeout
  | 'server'    // Error 500+
  | 'unknown';  // Otros
// #end-type
// #interface ErrorWithStatus - Estructura mínima esperada en errores con código de estado HTTP
/**
 * @description Forma estructurada de un objeto de error que puede contener un código de estado HTTP.
 * @purpose Permitir la inspección segura de errores desconocidos buscando propiedades de estado.
 * @context Utilizado internamente por detectServerErrorType para clasificar errores con status 500+.
 * @remarks Esta interfaz es interna al módulo y no se re-exporta via index.ts.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export interface ErrorWithStatus {
  // #v-field status - código de estado HTTP del error
  /** código de estado HTTP devuelto por el servidor */
  status?: number;
  // #end-v-field
  // #v-field name - nombre técnico del error
  /** nombre técnico del error, equivalente a Error.name */
  name?: string;
  // #end-v-field
  // #v-field message - mensaje descriptivo del error
  /** mensaje descriptivo del error, equivalente a Error.message */
  message?: string;
  // #end-v-field
}
// #end-interface
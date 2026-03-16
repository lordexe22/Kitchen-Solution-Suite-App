/* src/services/companies/companies.types.ts */
import type { Company } from '../../types/companies.types';

// #interface GetAllCompaniesParams - Parámetros de filtrado para listar compañías
/**
 * @description
 * Parámetros opcionales para filtrar y paginar la consulta de compañías del usuario.
 *
 * @purpose
 * Centralizar las opciones de filtrado disponibles al consultar el listado de compañías.
 *
 * @context
 * Utilizado por la función getAllCompanies del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface GetAllCompaniesParams {
  // #v-field state - estado de las compañías a filtrar
  /** filtra compañías por su estado operativo */
  state?: 'active' | 'archived';
  // #end-v-field

  // #v-field page - número de página para paginación
  /** número de página solicitada en la paginación */
  page?: number;
  // #end-v-field

  // #v-field limit - cantidad de resultados por página
  /** cantidad máxima de resultados a retornar por página */
  limit?: number;
  // #end-v-field
}
// #end-interface

// #interface GetAllCompaniesResponse - Respuesta del endpoint de listado de compañías
/**
 * @description
 * Estructura de respuesta del servidor al consultar el listado de compañías del usuario.
 *
 * @purpose
 * Tipar la respuesta del endpoint GET /dashboard/company incluyendo metadata de paginación.
 *
 * @context
 * Utilizado por la función getAllCompanies del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface GetAllCompaniesResponse {
  // #v-field success - indica si la operación fue exitosa
  /** indica si la solicitud fue procesada correctamente */
  success: boolean;
  // #end-v-field

  // #v-field companies - lista de compañías retornadas
  /** listado de compañías del usuario autenticado */
  companies: Company[];
  // #end-v-field

  // #v-field total - total de compañías disponibles
  /** total de compañías sin aplicar paginación */
  total: number;
  // #end-v-field

  // #v-field page - página actual
  /** número de página retornado */
  page: number;
  // #end-v-field

  // #v-field limit - límite aplicado
  /** cantidad de resultados por página aplicada */
  limit: number;
  // #end-v-field

  // #v-field totalPages - total de páginas disponibles
  /** total de páginas calculadas según el limit y el total */
  totalPages: number;
  // #end-v-field
}
// #end-interface

// #interface CreateCompanyResponse - Respuesta del endpoint de creación de compañía
/**
 * @description
 * Estructura de respuesta del servidor al crear una nueva compañía.
 *
 * @purpose
 * Tipar la respuesta del endpoint POST /dashboard/company.
 *
 * @context
 * Utilizado por la función createCompany del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface CreateCompanyResponse {
  // #v-field success - indica si la operación fue exitosa
  /** indica si la compañía fue creada correctamente */
  success: boolean;
  // #end-v-field

  // #v-field company - compañía creada
  /** datos de la compañía recién creada */
  company: Company;
  // #end-v-field
}
// #end-interface

// #interface UpdateCompanyResponse - Respuesta del endpoint de actualización de compañía
/**
 * @description
 * Estructura de respuesta del servidor al actualizar una compañía existente.
 *
 * @purpose
 * Tipar la respuesta del endpoint PATCH /dashboard/company/:id.
 *
 * @context
 * Utilizado por la función updateCompany del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface UpdateCompanyResponse {
  // #v-field success - indica si la operación fue exitosa
  /** indica si la compañía fue actualizada correctamente */
  success: boolean;
  // #end-v-field

  // #v-field company - compañía actualizada
  /** datos actualizados de la compañía */
  company: Company;
  // #end-v-field
}
// #end-interface

// #interface DeleteCompanyResponse - Respuesta del endpoint de eliminación de compañía
/**
 * @description
 * Estructura de respuesta del servidor al eliminar una compañía.
 *
 * @purpose
 * Tipar la respuesta del endpoint DELETE /dashboard/company/:id.
 *
 * @context
 * Utilizado por la función deleteCompany del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface DeleteCompanyResponse {
  // #v-field success - indica si la operación fue exitosa
  /** indica si la compañía fue eliminada correctamente */
  success: boolean;
  // #end-v-field
}
// #end-interface

// #interface CheckNameResponse - Respuesta del endpoint de verificación de nombre
/**
 * @description
 * Estructura de respuesta del servidor al verificar la disponibilidad de un nombre de compañía.
 *
 * @purpose
 * Tipar la respuesta del endpoint de validación de nombre único antes de crear una compañía.
 *
 * @context
 * Utilizado por la función checkCompanyName del servicio de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface CheckNameResponse {
  // #v-field success - indica si la operación fue exitosa
  /** indica si la solicitud fue procesada correctamente */
  success: boolean;
  // #end-v-field

  // #v-field available - indica si el nombre está disponible
  /** true si el nombre no está registrado y puede ser utilizado */
  available: boolean;
  // #end-v-field
}
// #end-interface

/* src/types/companies.types.ts */

// #interface Company - Entidad compañía del frontend
/**
 * @description
 * Representa una compañía dentro del sistema de frontend.
 *
 * @purpose
 * Centralizar la estructura de datos de una compañía tal como la recibe y utiliza el cliente.
 *
 * @context
 * Utilizado en los servicios, store y componentes que manipulan entidades de tipo compañía.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface Company {
  // #v-field id - Identificador único de la compañía
  /** identificador único de la compañía */
  id: number;
  // #end-v-field
  // #v-field name - Nombre de la compañía
  /** nombre de la compañía */
  name: string;
  // #end-v-field
  // #v-field description - Descripción opcional de la compañía
  /** descripción opcional de la compañía */
  description: string | null;
  // #end-v-field
  // #v-field ownerId - Identificador del propietario
  /** identificador del usuario propietario de la compañía */
  ownerId: number;
  // #end-v-field
  // #v-field logoUrl - URL del logo de la compañía
  /** URL del logo de la compañía */
  logoUrl: string | null;
  // #end-v-field
  // #v-field state - Estado de la compañía
  /** estado actual de la compañía */
  state: 'active' | 'archived';
  // #end-v-field
  // #v-field archivedAt - Fecha de archivado
  /** fecha de archivado en formato ISO string (null si no está archivada) */
  archivedAt: string | null;
  // #end-v-field
  // #v-field createdAt - Fecha de creación
  /** fecha de creación en formato ISO string */
  createdAt: string;
  // #end-v-field
  // #v-field updatedAt - Fecha de última actualización
  /** fecha de última actualización en formato ISO string */
  updatedAt: string;
  // #end-v-field
}
// #end-interface

// #type CompanyFormData - Datos del formulario para crear o editar una compañía
/**
 * @description
 * Datos ingresados por el usuario para crear o editar una compañía.
 *
 * @purpose
 * Separar los datos de formulario de la entidad completa, limitando los campos editables desde el cliente.
 *
 * @context
 * Utilizado en los componentes de formulario de creación y edición de compañías.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type CompanyFormData = {
  /** nombre de la compañía */
  name: string;
  /** descripción opcional */
  description?: string;
  /** URL del logo */
  logoUrl?: string;
};
// #end-type

/* src/store/Companies/Companies.types.ts */
import type { Company } from '../../types/companies.types';

// #interface CompaniesStore - forma del store de Zustand para gestionar el estado de compañías
/**
 * @description Forma del store de Zustand para gestionar el estado de compañías en el cliente.
 * @purpose Centralizar el estado de compañías y proveer acciones para su manipulación sincrónica.
 * @context Usado en hooks y componentes del dashboard. El fetching lo realizan los services, no este store.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export interface CompaniesStore {
  // #v-field companies - lista de compañías cargadas en el store
  /** lista de compañías cargadas en el store */
  companies: Company[];
  // #end-v-field

  // #v-field isHydrated - indica si el store fue hidratado desde el servidor
  /** indica si el store fue hidratado con datos del servidor al menos una vez */
  isHydrated: boolean;
  // #end-v-field

  // #f-field setCompanies - reemplaza la lista completa de compañías
  /** reemplaza la lista completa de compañías */
  setCompanies: (companies: Company[]) => void;
  // #end-f-field

  // #f-field hydrateCompanies - carga compañías y marca el store como hidratado
  /** carga las compañías y marca el store como hidratado */
  hydrateCompanies: (companies: Company[]) => void;
  // #end-f-field

  // #f-field addCompany - agrega una compañía al final de la lista
  /** agrega una nueva compañía al final de la lista */
  addCompany: (company: Company) => void;
  // #end-f-field

  // #f-field updateCompany - actualiza una compañía por id con datos parciales
  /** actualiza los datos de una compañía identificada por su id */
  updateCompany: (id: number, updates: Partial<Company>) => void;
  // #end-f-field

  // #f-field removeCompany - elimina una compañía de la lista por id
  /** elimina una compañía de la lista por su id */
  removeCompany: (id: number) => void;
  // #end-f-field

  // #f-field clearCompanies - restablece el store a su estado inicial
  /** limpia la lista de compañías y restablece isHydrated a false */
  clearCompanies: () => void;
  // #end-f-field
}
// #end-interface

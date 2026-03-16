/* kitchen-solutions-suite-app\src\store\local\Local.types.ts */

// #interface Local - Entidad local/sucursal dentro del sistema
/**
 * @description
 * Representa un local o sucursal dentro del sistema.
 *
 * @purpose
 * Centralizar la estructura de datos de un local tal como es manejada en el estado del cliente.
 *
 * @context
 * Utilizado por el LocalStore y los componentes que operan con sucursales.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface Local {
  // #v-field id - Identificador único del local
  /** identificador único del local */
  id: number;
  // #end-v-field
  // #v-field name - Nombre del local
  /** nombre del local o sucursal */
  name: string;
  // #end-v-field
  // #v-field address - Dirección física del local
  /** dirección física del local */
  address: string;
  // #end-v-field
  // #v-field phone - Teléfono de contacto del local
  /** teléfono de contacto del local */
  phone?: string;
  // #end-v-field
}
// #end-interface
// #interface LocalStore - Estado y acciones del store de locales
/**
 * @description
 * Define el estado y las acciones del store de locales del sistema.
 *
 * @purpose
 * Centralizar la gestión del estado de locales/sucursales en un único punto de control del cliente.
 *
 * @context
 * Utilizado como store de Zustand en componentes y servicios que requieren trabajar con sucursales.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface LocalStore {
  // #v-field locals - Lista de locales disponibles
  /** lista de locales disponibles en el sistema */
  locals: Local[];
  // #end-v-field
  // #v-field isHydrated - Estado de hidratación del store
  /** indica si el store fue inicializado con datos del servidor */
  isHydrated: boolean;
  // #end-v-field
  // #f-field setLocals - Reemplaza la lista completa de locales
  /** reemplaza la lista completa de locales */
  setLocals: (locals: Local[]) => void;
  // #end-f-field
  // #f-field hydrateLocals - Inicializa los locales desde el servidor
  /** inicializa los locales con datos provenientes del servidor */
  hydrateLocals: (locals: Local[]) => void;
  // #end-f-field
  // #f-field addLocal - Agrega un nuevo local
  /** agrega un nuevo local a la lista */
  addLocal: (local: Local) => void;
  // #end-f-field
  // #f-field updateLocal - Actualiza un local existente
  /** aplica actualizaciones parciales a un local existente */
  updateLocal: (id: number, updates: Partial<Local>) => void;
  // #end-f-field
  // #f-field removeLocal - Elimina un local por id
  /** elimina un local de la lista por su identificador */
  removeLocal: (id: number) => void;
  // #end-f-field
  // #f-field clearLocals - Limpia la lista de locales
  /** vacía la lista de locales del store */
  clearLocals: () => void;
  // #end-f-field
}
// #end-interface
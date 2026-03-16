/* src/store/UserData.types.ts */

// #type UserType - Rol del usuario dentro del sistema
/**
 * @description
 * Roles disponibles para un usuario dentro del sistema.
 *
 * @purpose
 * Tipificar el rol del usuario para controlar el acceso y el comportamiento diferenciado por perfil.
 *
 * @context
 * Utilizado en la entidad User, en el store de datos de usuario y en la lógica de permisos.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type UserType = 'admin' | 'employee' | 'guest' | 'ownership' | null;
// #end-type

// #type UserState - Estado del usuario dentro del sistema
/**
 * @description
 * Estados posibles de la cuenta de un usuario.
 *
 * @purpose
 * Tipificar el estado del ciclo de vida del usuario para controlar el acceso y los flujos de activación.
 *
 * @context
 * Utilizado en la entidad User y en validaciones de acceso al sistema.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type UserState = 'pending' | 'active' | 'suspended' | null;
// #end-type

// #interface User - Entidad de usuario autenticado
/**
 * @description
 * Representa la entidad completa de un usuario autenticado dentro del sistema.
 *
 * @purpose
 * Centralizar todos los datos del usuario para su uso en store, servicios y lógica de negocio del cliente.
 *
 * @context
 * Utilizado por el UserDataStore y por cualquier servicio o componente que requiera datos del usuario actual.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface User {
  // #v-field id - Identificador único del usuario
  /** identificador único del usuario en la base de datos */
  id: number;
  // #end-v-field
  // #v-field firstName - Nombre del usuario
  /** nombre de pila del usuario */
  firstName: string;
  // #end-v-field
  // #v-field lastName - Apellido del usuario
  /** apellido del usuario */
  lastName: string;
  // #end-v-field
  // #v-field email - Correo electrónico del usuario
  /** correo electrónico utilizado para autenticación */
  email: string;
  // #end-v-field
  // #v-field imageUrl - URL de la imagen de perfil
  /** URL de la imagen de perfil del usuario */
  imageUrl: string | null;
  // #end-v-field
  // #v-field type - Rol del usuario en el sistema
  /** rol asignado al usuario dentro del sistema */
  type: UserType;
  // #end-v-field
  // #v-field belongToBranchId - ID del local al que pertenece
  /** identificador del local/sucursal al que pertenece el usuario */
  belongToBranchId: number | null;
  // #end-v-field
  // #v-field belongToCompanyId - ID de la compañía a la que pertenece
  /** identificador de la compañía a la que pertenece el usuario */
  belongToCompanyId: number | null;
  // #end-v-field
  // #v-field state - Estado de la cuenta del usuario
  /** estado actual de la cuenta del usuario */
  state: UserState;
  // #end-v-field
}
// #end-interface

// #type EditableUserFields - Campos del usuario editables desde el cliente
/**
 * @description
 * Subconjunto de campos del usuario que pueden ser editados desde el lado del cliente.
 *
 * @purpose
 * Limitar qué propiedades del usuario puede modificar directamente el cliente, por seguridad y diseño.
 *
 * @context
 * Utilizado en la acción de actualización del UserDataStore.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type EditableUserFields = Pick<User, 'firstName' | 'lastName' | 'email' | 'imageUrl'>;
// #end-type

// #interface UserDataStore - Store de datos del usuario autenticado
/**
 * @description
 * Define el estado y las acciones del store de datos del usuario actual.
 *
 * @purpose
 * Centralizar la gestión de la identidad del usuario autenticado en un único punto de control del cliente.
 *
 * @context
 * Utilizado como store de Zustand por componentes y servicios que requieren operar con el usuario actual.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface UserDataStore {
  // #v-field user - Entidad del usuario autenticado
  user: User | null;
  // #end-v-field
  // #v-field isHydrated - Estado de hidratación del store
  isHydrated: boolean;
  // #end-v-field
  // #f-field update - Actualiza campos editables del usuario
  update: (partial: Partial<EditableUserFields>) => void;
  // #end-f-field
  // #f-field getUserDataFromServer - Sincroniza datos del usuario desde el servidor
  getUserDataFromServer: (user: User | null) => void;
  // #end-f-field
  // #f-field logout - Limpia los datos del usuario al cerrar sesión
  logout: () => void;
  // #end-f-field
};
// #end-interface

// #type ValidationResult - Resultado genérico de una operación de validación
/**
 * @description
 * Resultado discriminado de una operación de validación.
 *
 * @purpose
 * Proveer un contrato explícito para retornar el resultado de validaciones, diferenciando éxito y fallo.
 *
 * @context
 * Utilizado por la función validateAndNormalizeUser y otras validaciones del store.
 *
 * @template T Tipo del valor retornado en caso de éxito
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; reason: string };
// #end-type

// #section validation helpers
export const allowedTypes = ['admin', 'employee', 'guest', 'ownership'] as const;
export const allowedStates = ['pending', 'active', 'suspended'] as const;

const isPositiveInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n > 0;
const isNullablePositiveInt = (n: unknown): n is number | null => n === null || isPositiveInt(n);
const normalizeString = (s: unknown): string => (typeof s === 'string' ? s.trim() : '');
const normalizeEmail = (s: unknown): string => normalizeString(s).toLowerCase();
const normalizeImageUrl = (s: unknown): string | null => {
  if (s === null || s === undefined) return null;
  const v = normalizeString(s);
  return v.length === 0 ? null : v;
};

// Validate a fully built user
export const validateAndNormalizeUser = (candidate: Partial<User>): ValidationResult<User> => {
  const id = candidate.id;
  const firstName = normalizeString(candidate.firstName);
  const lastName = normalizeString(candidate.lastName);
  const email = normalizeEmail(candidate.email);
  const type = candidate.type;
  const state = candidate.state;
  const belongToCompanyId = candidate.belongToCompanyId ?? null;
  const belongToBranchId = candidate.belongToBranchId ?? null;
  const imageUrl = normalizeImageUrl(candidate.imageUrl ?? null);

  if (!isPositiveInt(id)) return { ok: false, reason: 'id must be a positive integer' };
  if (!firstName) return { ok: false, reason: 'firstName is required' };
  if (!lastName) return { ok: false, reason: 'lastName is required' };
  if (!email) return { ok: false, reason: 'email is required' };
  if (type === null || type === undefined || !allowedTypes.includes(type)) return { ok: false, reason: 'type is invalid' };
  if (state === null || state === undefined || !allowedStates.includes(state)) return { ok: false, reason: 'state is invalid' };
  if (!isNullablePositiveInt(belongToCompanyId)) return { ok: false, reason: 'belongToCompanyId must be null or positive integer' };
  if (!isNullablePositiveInt(belongToBranchId)) return { ok: false, reason: 'belongToBranchId must be null or positive integer' };

  if (type === 'employee') {
    if (belongToCompanyId === null || belongToBranchId === null) {
      return { ok: false, reason: 'employee must have belongToCompanyId and belongToBranchId' };
    }
  }

  const normalized: User = {
    id,
    firstName,
    lastName,
    email,
    imageUrl,
    type: type as Exclude<UserType, null>,
    belongToBranchId,
    belongToCompanyId,
    state: state as Exclude<UserState, null>,
  };

  return { ok: true, value: normalized };
};

// Validate and normalize only editable fields (client-side updates)
export const validateAndNormalizeEditableFields = (
  partial: Partial<EditableUserFields>,
  existing: User | null
): ValidationResult<User> => {
  if (!existing) return { ok: false, reason: 'cannot update editable fields when user is null' };

  const firstName = 'firstName' in partial ? normalizeString(partial.firstName) : existing.firstName;
  const lastName = 'lastName' in partial ? normalizeString(partial.lastName) : existing.lastName;
  const email = 'email' in partial ? normalizeEmail(partial.email) : existing.email;
  const imageUrl = 'imageUrl' in partial ? normalizeImageUrl(partial.imageUrl) : existing.imageUrl;

  if (!firstName) return { ok: false, reason: 'firstName cannot be empty' };
  if (!lastName) return { ok: false, reason: 'lastName cannot be empty' };
  if (!email) return { ok: false, reason: 'email is required' };

  const updated: User = {
    ...existing,
    firstName,
    lastName,
    email,
    imageUrl,
  };

  return { ok: true, value: updated };
};
// #end-section
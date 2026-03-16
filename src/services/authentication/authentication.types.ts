/* src/services/authentication/authentication.types.ts */

// #type PlatformName - Plataformas de autenticación soportadas
/**
 * @description
 * Identificadores de las plataformas de autenticación disponibles en el sistema.
 *
 * @purpose
 * Restringir los datos de autenticación a las plataformas soportadas por el sistema.
 *
 * @context
 * Utilizado en los tipos de datos de registro e inicio de sesión del servicio de autenticación.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type PlatformName = 'local' | 'google';
// #end-type

// #type RegisterUserData - Datos necesarios para registrar un nuevo usuario
/**
 * @description
 * Estructura de datos requerida para registrar un nuevo usuario en el sistema.
 *
 * @purpose
 * Centralizar todos los campos del proceso de registro, contemplando autenticación local y OAuth.
 *
 * @context
 * Utilizado por el servicio de autenticación al invocar el endpoint de registro.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type RegisterUserData = {
  /** plataforma de autenticación seleccionada */
  platformName: PlatformName;
  /** nombre de pila del usuario */
  firstName: string;
  /** apellido del usuario */
  lastName: string;
  /** correo electrónico del usuario */
  email: string;
  /** contraseña para autenticación local (null si es OAuth) */
  password: string | null;
  /** token de la plataforma OAuth cuando corresponda */
  platformToken?: string | null;
  /** URL de imagen de perfil proveniente del proveedor OAuth */
  imageUrl?: string | null;
  /** token JWT completo de Google para validación en backend */
  credential?: string;
};
// #end-type

// #type UserLoginData - Datos necesarios para iniciar sesión
/**
 * @description
 * Estructura de datos requerida para autenticar a un usuario en el sistema.
 *
 * @purpose
 * Centralizar los campos de inicio de sesión contemplando autenticación local y OAuth.
 *
 * @context
 * Utilizado por el servicio de autenticación al invocar el endpoint de login.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type UserLoginData = {
  /** correo electrónico del usuario (autenticación local) */
  email?: string;
  /** contraseña del usuario (autenticación local) */
  password?: string;
  /** plataforma de autenticación utilizada */
  platformName: PlatformName;
  /** token JWT completo de Google para validación en backend */
  credential?: string;
};
// #end-type

// #type UserResponse - Respuesta del servidor al autenticar un usuario
/**
 * @description
 * Estructura de la respuesta del servidor luego de un proceso de autenticación.
 *
 * @purpose
 * Definir el contrato de datos que retorna el backend al autenticar un usuario, listo para ser consumido por el cliente.
 *
 * @context
 * Utilizado por el servicio de autenticación para procesar y retornar la respuesta del servidor al store.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type UserResponse = {
  /** datos del usuario autenticado o null si la autenticación falló */
  data: {
    /** identificador único del usuario */
    id: number;
    /** correo electrónico del usuario */
    email: string;
    /** nombre de pila del usuario */
    firstName: string;
    /** apellido del usuario */
    lastName: string;
    /** URL de imagen de perfil */
    imageUrl: string | null;
    /** rol del usuario en el sistema */
    type: 'admin' | 'employee' | 'guest' | 'ownership';
    /** identificador del local al que pertenece */
    belongToBranchId: number | null;
    /** identificador de la compañía a la que pertenece */
    belongToCompanyId: number | null;
    /** estado actual de la cuenta */
    state: 'pending' | 'active' | 'suspended';
  } | null;
};
// #end-type

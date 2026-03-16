/* authenticatorWithGoogle.types.ts */
/** #info
 * Tipos e interfaces del módulo authenticatorWithGoogle
*/
import type { CredentialResponse } from '@react-oauth/google';

// #interface GoogleUser - Datos del usuario obtenidos del token de Google decodificado
/**
 * @description
 * Estructura de datos del usuario obtenida al decodificar el token de ID de Google.
 *
 * @purpose
 * Representar los datos crudos del usuario tal como los retorna Google, para procesarlos internamente.
 *
 * @context
 * Utilizado por el módulo authenticatorWithGoogle al procesar la respuesta del flujo OAuth.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface GoogleUser {
  // #v-field iss - Emisor del token
  /** emisor del token (Google) */
  iss: string;
  // #end-v-field
  // #v-field nbf - Not before timestamp
  /** timestamp a partir del cual el token es válido */
  nbf: number;
  // #end-v-field
  // #v-field aud - Client ID de la aplicación
  /** client_id de la aplicación registrado en Google */
  aud: string;
  // #end-v-field
  // #v-field azp - Authorized party
  /** parte autorizada del token */
  azp: string;
  // #end-v-field
  // #v-field sub - ID único del usuario en Google
  /** identificador único del usuario en Google */
  sub: string;
  // #end-v-field
  // #v-field email - Correo electrónico del usuario
  /** correo electrónico del usuario */
  email: string;
  // #end-v-field
  // #v-field email_verified - Verificación del correo
  /** indica si el correo electrónico fue verificado por Google */
  email_verified: boolean;
  // #end-v-field
  // #v-field name - Nombre completo del usuario
  /** nombre completo del usuario */
  name: string;
  // #end-v-field
  // #v-field picture - URL de la foto de perfil
  /** URL de la foto de perfil del usuario */
  picture: string;
  // #end-v-field
  // #v-field given_name - Nombre de pila
  /** nombre de pila del usuario */
  given_name: string;
  // #end-v-field
  // #v-field family_name - Apellido del usuario
  /** apellido del usuario */
  family_name: string;
  // #end-v-field
  // #v-field iat - Issued at timestamp
  /** timestamp de emisión del token */
  iat: number;
  // #end-v-field
  // #v-field exp - Expiration timestamp
  /** timestamp de expiración del token */
  exp: number;
  // #end-v-field
  // #v-field jti - JWT ID
  /** identificador único del JWT */
  jti: string;
  // #end-v-field
}
// #end-interface

// #interface GoogleConfig - Datos de conexión con la API de Google
/**
 * @description
 * Configuración necesaria para conectar con la API de autenticación de Google.
 *
 * @purpose
 * Centralizar los parámetros requeridos para inicializar el cliente OAuth de Google.
 *
 * @context
 * Utilizado por el módulo authenticatorWithGoogle para configurar el proveedor OAuth.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface GoogleConfig {
  // #v-field clientId - ID del cliente OAuth de Google
  /** identificador del cliente OAuth registrado en Google Cloud Console */
  clientId: string;
  // #end-v-field
}
// #end-interface

// #interface AuthenticatorWithGoogleProps - Props del componente AuthenticatorWithGoogle
/**
 * @description
 * Props del componente AuthenticatorWithGoogle.
 *
 * @purpose
 * Definir el contrato de entrada del componente que gestiona el flujo de autenticación con Google.
 *
 * @context
 * Utilizado por los componentes de login y registro que incorporan autenticación OAuth con Google.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AuthenticatorWithGoogleProps {
  // #f-field onAuth - Callback al completar la autenticación
  /** callback que recibe el CredentialResponse completo (token JWT sin validar) */
  onAuth: (response: CredentialResponse) => void;
  // #end-f-field
  // #v-field mode - Modo de uso del botón
  /** modo de uso del botón: login para iniciar sesión, register para nueva cuenta */
  mode: "login" | "register";
  // #end-v-field
}
// #end-interface
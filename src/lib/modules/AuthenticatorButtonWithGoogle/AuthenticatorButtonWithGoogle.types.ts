// AuthenticatorButtonWithGoogle.types.ts
/* #info - Tipos e interfaces del componente AuthenticatorButtonWithGoogle */

// #interface GoogleUserRaw - Datos crudos del usuario obtenidos del token de Google decodificado
/**
 * @description
 * Estructura cruda del payload de un token de ID de Google tras su decodificación.
 *
 * @purpose
 * Modelar los datos exactos que retorna Google en el token para su procesamiento interno.
 *
 * @context
 * Utilizado internamente por el módulo AuthenticatorButtonWithGoogle al decodificar el token JWT.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface GoogleUserRaw {
  // #v-field iss - emisor del token
  /** emisor del token (Google) */
  iss: string;
  // #end-v-field
  // #v-field nbf - not before timestamp
  /** timestamp a partir del cual el token es válido */
  nbf: number;
  // #end-v-field
  // #v-field aud - client ID de la aplicación
  /** client ID de la aplicación registrado en Google */
  aud: string;
  // #end-v-field
  // #v-field azp - authorized party
  /** parte autorizada del token (client ID) */
  azp: string;
  // #end-v-field
  // #v-field sub - ID único del usuario en Google
  /** identificador único del usuario en Google */
  sub: string;
  // #end-v-field
  // #v-field email - correo electrónico del usuario
  /** correo electrónico del usuario */
  email: string;
  // #end-v-field
  // #v-field email_verified - estado de verificación del correo
  /** indica si el correo fue verificado por Google */
  email_verified: boolean;
  // #end-v-field
  // #v-field name - nombre completo del usuario
  /** nombre completo del usuario */
  name: string;
  // #end-v-field
  // #v-field picture - URL de la foto de perfil
  /** URL de la foto de perfil del usuario */
  picture: string;
  // #end-v-field
  // #v-field given_name - nombre de pila del usuario
  /** nombre de pila del usuario */
  given_name: string;
  // #end-v-field
  // #v-field family_name - apellido del usuario
  /** apellido del usuario */
  family_name: string;
  // #end-v-field
  // #v-field iat - issued at timestamp
  /** timestamp de emisión del token */
  iat: number;
  // #end-v-field
  // #v-field exp - expiration timestamp
  /** timestamp de expiración del token */
  exp: number;
  // #end-v-field
  // #v-field jti - JWT ID
  /** identificador único del JWT */
  jti: string;
  // #end-v-field
}
// #end-interface
// #interface AuthSuccessResponse - Respuesta completa de autenticación exitosa
/**
 * @description
 * Datos normalizados retornados al componente consumidor luego de una autenticación exitosa con Google.
 *
 * @purpose
 * Proveer al consumidor del componente toda la información del usuario autenticado en una estructura limpia.
 *
 * @context
 * Retornado por el callback onSuccess del componente AuthenticatorButtonWithGoogle.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AuthSuccessResponse {
  // #v-field email - email address
  /** User email address */
  email: string;
  // #end-v-field
  // #v-field emailVerified - Whether email is verified in Google account
  /** Whether email is verified in Google account */
  emailVerified: boolean;
  // #end-v-field
  // #v-field firstName - User's first name
  /** User's first name */
  firstName: string;
  // #end-v-field
  // #v-field lastName - User's last name
  /** User's last name */
  lastName: string;
  // #end-v-field
  // #v-field profilePicture - URL to user's profile picture
  /** URL to user's profile picture */
  profilePicture: string;
  // #end-v-field
  // #v-field googleId - Unique Google user ID
  /** Unique Google user ID */
  googleId: string;
  // #end-v-field
  // #v-field credential - ID token (JWT) for backend validation
  /** ID token (JWT) for backend validation - send this to your server */
  credential: string;
  // #end-v-field
  // #v-field provider - Authentication provider
  /** Authentication provider (always 'google') */
  provider: "google";
  // #end-v-field
}
// #end-interface
// #interface ErrorData - Datos estructurados de un error de autenticación
/**
 * @description
 * Estructura de datos que describe un error ocurrido durante el proceso de autenticación.
 *
 * @purpose
 * Proveer información estructurada y tipada sobre los errores para su manejo por el consumidor.
 *
 * @context
 * Retornado por el callback onError del componente AuthenticatorButtonWithGoogle.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface ErrorData {
  // #v-field message - Error message
  /** Error message describing what went wrong */
  message: string;
  // #end-v-field
  // #v-field code - Código identificador del error
  /** código identificador del tipo de error */
  code: string;
  // #end-v-field
  // #v-field timestamp - ISO timestamp of when the error occurred
  /** ISO timestamp of when the error occurred */
  timestamp: string;
  // #end-v-field
}
// #end-interface
// #interface AuthenticatorButtonWithGoogleProps - Props del componente AuthenticatorButtonWithGoogle
/**
 * @description
 * Props del componente AuthenticatorButtonWithGoogle.
 *
 * @purpose
 * Definir el contrato de entrada del componente de botón de autenticación con Google.
 *
 * @context
 * Utilizado en los componentes de login y registro que incorporan autenticación OAuth con Google.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AuthenticatorButtonWithGoogleProps {
  // #f-field onSuccess - Callback for successful authentication
  /** Callback that receives the authentication data on success */
  onSuccess: (data: AuthSuccessResponse) => void;
  // #end-f-field
  // #f-field onError - Callback for authentication errors
  /** Callback that receives error data on failure */
  onError: (error: ErrorData) => void;
  // #end-f-field
  // #v-field size - Size of the button
  /** Size of the button */
  size?: "large" | "medium" | "small";
  // #end-v-field
  // #v-field shape - Shape of the button
  /** Shape of the button */
  shape?: "rectangular" | "pill" | "circle" | "square";
  // #end-v-field
  // #v-field logo_alignment - Alignment of the Google logo
  /** Alignment of the Google logo */
  logo_alignment?: "left" | "center";
  // #end-v-field
  // #v-field width - Width of the button in pixels
  /** Width of the button in pixels */
  width?: string;
  // #end-v-field
  // #v-field type - Button type
  /** Button type: standard (with text) or icon (icon only) */
  type?: "standard" | "icon";
  // #end-v-field
  // #v-field theme - Button theme
  /** Button theme */
  theme?: "outline" | "filled_blue" | "filled_black";
  // #end-v-field
  // #v-field ux_mode - UX mode (popup or redirect)
  /** UX mode: popup or redirect */
  ux_mode?: "popup" | "redirect";
  // #end-v-field
  // #v-field className - Additional CSS class for the container
  /** Additional CSS class for the container */
  className?: string;
  // #end-v-field
}
// #end-interface

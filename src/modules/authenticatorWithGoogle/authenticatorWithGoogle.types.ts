/* authenticatorWithGoogle.types.ts */
/** #info
 * in this file we define the types and interfacer for the component
*/
// #interface GoogleUser - user data obtained from decoded google token
export interface GoogleUser {
  iss: string;       // issuer
  nbf: number;
  aud: string;       // client_id de la app
  azp: string;
  sub: string;       // ID único del usuario
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}
// #end-interface
// #interface GoogleConfig - connection data for google api
export interface GoogleConfig {
  clientId: string;
}
// #end-interface
// #interface AuthenticatorWithGoogleProps - props for AuthenticatorWithGoogle component
/**
 * Props del componente AuthenticatorWithGoogle.
 */
export interface AuthenticatorWithGoogleProps {
  /** Callback que recibe el usuario decodificado luego de un login exitoso. */
  onAuth: (user: GoogleUser | null) => void;
  /** Modo de uso del botón, que define si se está logueando o creando una nueva cuenta. */
  mode: "login" | "register";
}
// #end-interface
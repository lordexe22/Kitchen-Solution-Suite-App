// authenticatorWithGoogle.d.ts

/**  #info
 * In this file, we extend or redefine the types and interface from external modules
*/

// En caso de que el compilador no reconozca el módulo, esta declaración evita errores.
// Si no hay problemas, este archivo puede quedar vacío o eliminarse.
declare module "@react-oauth/google" {
  export interface CredentialResponse {
    credential?: string;
    select_by?: string;
    clientId?: string;
  }
}

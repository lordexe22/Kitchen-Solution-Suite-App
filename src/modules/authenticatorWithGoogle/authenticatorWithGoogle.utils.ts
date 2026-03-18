// authenticatorWithGoogle.utils.ts
// #section Imports
import type { GoogleUser } from "./authenticatorWithGoogle.types";
import type { CredentialResponse } from "@react-oauth/google";
// #end-section
// #function decodeGoogleToken - Decodifica un JWT de Google y retorna su payload
/**
 * @description Decodifica un JWT de Google y retorna su payload.
 * @purpose Extraer los datos del usuario del token de credencial para su uso en el flujo de autenticación.
 * @context Utilizado en el módulo de autenticación con Google antes de enviar el token al servidor.
 * @param token JWT devuelto en GoogleAuthResponse.credential
 * @returns payload del token con los datos del usuario (GoogleUser)
 * @throws Error si el token no contiene payload válido
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const decodeGoogleToken = (token: string): GoogleUser => {
  const base64Url = token.split(".")[1];
  if (!base64Url) {
    throw new Error("Token inválido: no contiene payload");
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload) as GoogleUser;
}
// #end-function
// #function handleGoogleSuccess - Procesa el login exitoso de Google
/**
 * @description Maneja el éxito de la autenticación con Google pasando el credential JWT completo al callback del servidor.
 * @purpose Validar que la respuesta de Google contiene una credencial antes de delegarla al servidor para verificación.
 * @context Utilizado como handler de onSuccess en el módulo de autenticación. El servidor valida la firma del JWT.
 * @param response respuesta que devuelve GoogleLogin con el campo credential
 * @param onAuth callback que recibe el CredentialResponse completo para enviarlo al servidor
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const handleGoogleSuccess = (
  response: CredentialResponse,
  onAuth: (response: CredentialResponse) => void
) => {
  if (!response.credential) {
    console.error("Google login failed: credential is missing");
    return;
  }

  // Pasar el credential JWT completo sin decodificar
  // El servidor será responsable de validar la firma
  onAuth(response);
};
// #end-function
// #function handleGoogleError - Maneja errores de login con Google
/**
 * @description Maneja el error de autenticación con Google registrando el evento en consola.
 * @purpose Proveer un punto centralizado para el manejo de errores del flujo de login con Google.
 * @context Utilizado como handler de onError en el componente GoogleLogin del módulo de autenticación.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const handleGoogleError = () => {
  console.error("Google login failed");
};
// #end-function

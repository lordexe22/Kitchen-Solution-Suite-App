// authenticatorWithGoogle.utils.ts
// #section Imports
import type { GoogleUser } from "./authenticatorWithGoogle.types";
import type { CredentialResponse } from "@react-oauth/google";
// #end-section
// #function decodeGoogleToken - Decodifica un JWT de Google y retorna su payload
/**
 * Decodifica un JWT de Google y retorna su payload.
 * @param token JWT devuelto en GoogleAuthResponse.credential
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
 * Maneja el éxito de la autenticación con Google.
 * Pasa el credential completo (token JWT sin decodificar) al servidor para validación.
 * @param response Respuesta que devuelve GoogleLogin con credential.
 * @param onAuth Callback que recibe el CredentialResponse completo.
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
 * Maneja el error de autenticación con Google.
 * No llama al callback ya que el error ya fue manejado por GoogleLogin.
 */
export const handleGoogleError = () => {
  console.error("Google login failed");
};
// #end-function

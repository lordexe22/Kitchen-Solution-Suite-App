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
 * Decodifica el token y llama a la función de callback con el usuario decodificado.
 * @param response Respuesta que devuelve GoogleLogin.
 * @param onAuth Callback que recibe el usuario decodificado o null en caso de error.
 */
export const handleGoogleSuccess = (
  response: CredentialResponse,
  onAuth: (user: GoogleUser | null) => void
) => {
  if (!response.credential) {
    console.error("Google login failed: credential is missing");
    onAuth(null);
    return;
  }

  try {
    const googleUser = decodeGoogleToken(response.credential);
    onAuth(googleUser);
  } catch (err) {
    console.error("Error decoding Google token:", err);
    onAuth(null);
  }
};
// #end-function
// #function handleGoogleError - Maneja errores de login con Google
/**
 * Maneja el error de autenticación con Google.
 * Llama a la función de callback con null.
 * @param onAuth Callback que recibe null indicando fallo de autenticación.
 */
export const handleGoogleError = (onAuth: (user: GoogleUser | null) => void) => {
  console.error("Google login failed");
  onAuth(null);
};
// #end-function

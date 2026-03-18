// AuthenticatorButtonWithGoogle.utils.ts
/* #info - Utility functions for the component */
// #section Imports
import type { CredentialResponse } from "@react-oauth/google";
import type {
  GoogleUserRaw,
  ErrorData,
  AuthSuccessResponse,
} from "./AuthenticatorButtonWithGoogle.types";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  DEFAULT_PROVIDER,
} from "./AuthenticatorButtonWithGoogle.constants";
// #end-section
// #function decodeGoogleToken - Decodes a Google JWT and returns its payload
/**
 * @description Decodifica un JWT de Google y retorna su payload.
 * @purpose Extraer los datos del usuario del token de credencial antes de normalizarlos.
 * @context Utilizado por handleGoogleSuccess para obtener los datos crudos del usuario de Google.
 * @param token JWT token string emitido por Google
 * @returns payload del token con los datos crudos del usuario (GoogleUserRaw)
 * @throws Error si el token es inválido o no puede ser decodificado
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const decodeGoogleToken = (token: string): GoogleUserRaw => {
  // #step 1 - Split the token and decode the payload
  const base64Url = token.split(".")[1];
  if (!base64Url) {
    throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  }
  // #end-step
  // #step 2 - Decode base64 URL to JSON
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  // #end-step
  // #step 3 - Parse JSON to GoogleUserRaw and return it
  return JSON.parse(jsonPayload) as GoogleUserRaw;
  // #end-step
};
// #end-function
// #function normalizeGoogleUser - Converts Google token payload to AuthSuccessResponse
/**
 * @description Convierte el payload crudo del token de Google a la estructura AuthSuccessResponse.
 * @purpose Normalizar los datos del usuario para que el consumidor reciba un formato consistente.
 * @context Utilizado por handleGoogleSuccess después de decodificar el token.
 * @param googleUser payload crudo del token decodificado de Google
 * @param credential JWT original emitido por Google (ID token completo)
 * @returns estructura normalizada AuthSuccessResponse con los campos requeridos
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const normalizeGoogleUser = (
  googleUser: GoogleUserRaw,
  credential: string
): AuthSuccessResponse => {
  // #step 1 - Map identity fields
  const identity = {
    email: googleUser.email,
    emailVerified: googleUser.email_verified,
    firstName: googleUser.given_name,
    lastName: googleUser.family_name,
    profilePicture: googleUser.picture,
    googleId: googleUser.sub,
  };
  // #end-step
  // #step 2 - Attach credential and provider metadata
  return {
    ...identity,
    credential: credential,
    provider: DEFAULT_PROVIDER,
  };
  // #end-step
};
// #end-function
// #function createError - Creates a structured error object
/**
 * @description Construye un objeto de error estructurado con mensaje, código y timestamp.
 * @purpose Estandarizar los objetos de error que se envían al callback onError del consumidor.
 * @context Utilizado por handleGoogleSuccess y handleGoogleError al reportar errores.
 * @param message mensaje descriptivo del error
 * @param code identificador del tipo de error (ERROR_CODES)
 * @returns objeto de error con estructura ErrorData
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const createError = (message: string, code: string): ErrorData => {
  // #step 1 - Build error payload with timestamp
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
  };
  // #end-step
};
// #end-function
// #function handleGoogleSuccess - Processes successful Google login
/**
 * @description Procesa el éxito del login con Google: decodifica el token, normaliza los datos e invoca el callback de éxito.
 * @purpose Encapsular el flujo completo de éxito de Google Auth para que el componente solo exponga callbacks.
 * @context Utilizado como handler del prop onSuccess del componente GoogleLogin de @react-oauth/google.
 * @param response respuesta del componente GoogleLogin con la credencial JWT
 * @param onSuccess callback de éxito provisto por el consumidor
 * @param onError callback de error provisto por el consumidor
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const handleGoogleSuccess = (
  response: CredentialResponse,
  onSuccess: (data: AuthSuccessResponse) => void,
  onError: (error: ErrorData) => void
) => {
  // #step 1 - Validate credential presence
  if (!response.credential) {
    console.error(ERROR_MESSAGES.MISSING_CREDENTIAL);
    onError(
      createError(
        ERROR_MESSAGES.MISSING_CREDENTIAL,
        ERROR_CODES.MISSING_CREDENTIAL
      )
    );
    return;
  }
  // #end-step
  try {
    // #step 2 - Decode credential to raw user data
    const googleUserRaw = decodeGoogleToken(response.credential);
    // #end-step
    // #step 3 - Normalize data into final response shape
    const authResponse = normalizeGoogleUser(googleUserRaw, response.credential);
    // #end-step
    // #step 4 - Invoke consumer success callback
    onSuccess(authResponse);
    // #end-step
  } catch (err) {
    console.error(ERROR_MESSAGES.DECODE_ERROR, err);
    // #step 5 - Report decode errors to consumer
    onError(
      createError(ERROR_MESSAGES.DECODE_ERROR, ERROR_CODES.DECODE_ERROR)
    );
    // #end-step
  }
};
// #end-function
// #function handleGoogleError - Handles Google login errors
/**
 * @description Maneja los errores del flujo de autenticación con Google, notificando al consumidor.
 * @purpose Proveer un punto centralizado para el manejo de errores de Google Auth.
 * @context Utilizado como handler del prop onError del componente GoogleLogin de @react-oauth/google.
 * @param onError callback de error provisto por el consumidor
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const handleGoogleError = (
  onError: (error: ErrorData) => void
) => {
  // #step 1 - Log failure
  console.error(ERROR_MESSAGES.GOOGLE_LOGIN_FAILED);
  // #end-step
  // #step 2 - Build and emit error payload
  onError(
    createError(
      ERROR_MESSAGES.GOOGLE_LOGIN_FAILED,
      ERROR_CODES.GOOGLE_LOGIN_FAILED
    )
  );
  // #end-step
};
// #end-function
// #function validateWidth - Validates width prop
/**
 * Validates that width is a positive pixel number.
 * @param width Width as string
 * @returns boolean true if valid
 * @version 1.0.0
 */
export const validateWidth = (width?: string): boolean => {
  // #step 1 - Allow undefined/empty as valid (auto width)
  if (!width) return true;
  // #end-step
  // #step 2 - Parse and validate numeric value
  const num = parseInt(width, 10);
  return !isNaN(num) && num > 0;
  // #end-step
};
// #end-function

/* src/services/authentication/authentication.service.ts */
// #section Imports
import type { RegisterUserData, UserLoginData, UserResponse } from "./authentication.types";
import { httpClient } from '../../api/httpClient.instance';
// #end-section

// #service registerUser - Registra un nuevo usuario en el sistema
/**
 * @description Registra un nuevo usuario en el sistema.
 * @purpose Centralizar la llamada al endpoint de registro, delegando las validaciones al backend.
 * @context Utilizado por AuthRegisterModalWindow para crear nuevos usuarios con credenciales locales o Google.
 * @param registerUserData datos necesarios para crear el usuario
 * @returns datos del usuario registrado
 * @throws Error si la solicitud al backend falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const registerUser = async (registerUserData: RegisterUserData): Promise<UserResponse> => {
  return httpClient.post('/public/auth/register', registerUserData);
};
// #end-service
// #service loginUser - Inicia sesión de un usuario en el sistema
/**
 * @description Inicia sesión de un usuario en el sistema.
 * @purpose Centralizar la llamada al endpoint de login, delegando las validaciones al backend.
 * @context Utilizado por AuthLoginModalWindow para autenticar usuarios con credenciales locales o Google.
 * @param loginUserData datos del usuario para iniciar sesión
 * @returns datos del usuario autenticado
 * @throws Error si las credenciales son inválidas o la solicitud falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const loginUser = async (loginUserData: UserLoginData): Promise<UserResponse> => {
  return httpClient.post('/public/auth/login', loginUserData);
};
// #end-service
// #service autoLogin - Intenta autenticar al usuario usando el JWT almacenado en cookie
/**
 * @description Intenta autenticar al usuario automáticamente usando el JWT almacenado en cookie.
 * @purpose Recuperar la sesión del usuario al recargar la aplicación sin requerir login manual.
 * @context Utilizado por UserData.store al inicializar la aplicación para restaurar la sesión activa.
 * @returns datos del usuario autenticado si el token es válido
 * @throws Error si el token es inválido o ha expirado
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const autoLogin = async (): Promise<UserResponse> => {
  return httpClient.post('/public/auth/auto-login');
};
// #end-service
// #service logoutUser - Cierra la sesión del usuario eliminando el JWT de las cookies
/**
 * @description Cierra la sesión del usuario eliminando el JWT de las cookies del servidor.
 * @purpose Garantizar que el token sea invalidado en el servidor al cerrar sesión.
 * @context Utilizado por AppHeader en el flujo de logout del usuario.
 * @returns confirmación del logout exitoso
 * @throws Error si la solicitud al servidor falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const logoutUser = async (): Promise<{ success: boolean }> => {
  return httpClient.post('/public/auth/logout');
};
// #end-service

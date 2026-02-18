/* src/services/authentication/authentication.ts */
// #section Imports
import type { RegisterUserData, UserLoginData, UserResponse } from "./authentication.types";
import { httpClient } from '../../api/httpClient.instance';
// #end-section

// #function registerUser
/**
 * Registra un nuevo usuario en el sistema.
 * Las validaciones se realizan en el backend.
 *
 * @async
 * @param {RegisterUserData} registerUserData - Datos del usuario a registrar.
 * @returns {Promise<UserResponse>} Datos del usuario registrado.
 * @throws {Error} Si la solicitud al backend falla.
 */
export const registerUser = async (registerUserData: RegisterUserData): Promise<UserResponse> => {
  return httpClient.post('/public/auth/register', registerUserData);
};
// #end-function
// #function loginUser
/**
 * Inicia sesión de un usuario en el sistema.
 * Las validaciones se realizan en el backend.
 *
 * @async
 * @param {UserLoginData} loginUserData - Datos del usuario para iniciar sesión.
 * @returns {Promise<UserResponse>} Datos del usuario autenticado.
 * @throws {Error} Si las credenciales son inválidas o la solicitud falla.
 */
export const loginUser = async (loginUserData: UserLoginData): Promise<UserResponse> => {
  return httpClient.post('/public/auth/login', loginUserData);
};
// #end-function
// #function autoLogin
/**
 * Intenta autenticar al usuario automáticamente usando el JWT en cookie.
 * Si el token es válido, retorna los datos del usuario.
 *
 * @async
 * @returns {Promise<UserResponse>} Datos del usuario autenticado.
 * @throws {Error} Si el token es inválido o expiró.
 */
export const autoLogin = async (): Promise<UserResponse> => {
  return httpClient.post('/public/auth/auto-login');
};
// #end-function
// #function logoutUser
/**
 * Cierra la sesión del usuario eliminando el JWT de las cookies.
 *
 * @async
 * @returns {Promise<{ success: boolean }>} Confirmación del logout.
 * @throws {Error} Si la solicitud falla.
 */
export const logoutUser = async (): Promise<{ success: boolean }> => {
  return httpClient.post('/public/auth/logout');
};
// #end-function

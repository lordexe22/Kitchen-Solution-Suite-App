// src/services/authentication/authentication.ts
// #section Imports
import { API_CONFIG } from "../../config/config";
import type { RegisterUserData, UserLoginData } from "./authentication.types";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout/fetchWithTimeout";
// #end-section
// #function registerUser
/**
 * Registra un nuevo usuario en el sistema.
 * Las validaciones se realizan en el backend.
 *
 * @async
 * @param {RegisterUserData} registerUserData - Datos del usuario a registrar.
 * @returns {Promise<{user: any}>} Datos del usuario registrado.
 * @throws {Error} Si la solicitud al backend falla.
 */
export const registerUser = async (registerUserData: RegisterUserData) => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}${API_CONFIG.REGISTER_URL}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(registerUserData),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Registration failed');
  }

  return responseData.data;
};
// #end-function
// #function loginUser
/**
 * Inicia sesión de un usuario en el sistema.
 * Las validaciones se realizan en el backend.
 *
 * @async
 * @param {UserLoginData} loginUserData - Datos del usuario para iniciar sesión.
 * @returns {Promise<{user: any}>} Datos del usuario autenticado.
 * @throws {Error} Si las credenciales son inválidas o la solicitud falla.
 */
export const loginUser = async (loginUserData: UserLoginData) => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}${API_CONFIG.LOGIN_URL}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginUserData),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Login failed');
  }

  return responseData.data;
};
// #end-function
// #function logoutUser
/**
 * Cierra la sesión del usuario llamando al endpoint de logout.
 * Limpia la cookie HTTP-only del lado del servidor.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud al backend falla.
 */
export const logoutUser = async (): Promise<void> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}${API_CONFIG.LOGOUT_URL}`,
    {
      method: 'POST',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Logout failed');
  }
};
// #end-function
// #function autoLoginByToken
/**
 * Intenta autenticar al usuario automáticamente usando el JWT en cookie.
 * Si el token es válido, retorna los datos del usuario.
 *
 * @async
 * @returns {Promise<{user: any}>} Datos del usuario autenticado.
 * @throws {Error} Si el token es inválido o expiró.
 */
export const autoLoginByToken = async () => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}${API_CONFIG.AUTO_LOGIN_BY_TOKEN_URL}`,
    {
      method: 'POST',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Auto-login failed');
  }

  return responseData.data;
};
// #end-function
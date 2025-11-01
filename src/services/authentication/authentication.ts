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
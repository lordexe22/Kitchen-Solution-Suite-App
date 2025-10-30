// #section Imports
import { validateAndProcessEmail, validateAndProcessName, validatePassword } from "../../utils/authenticationValidations/authenticationValidations";
import { API_CONFIG } from "../../config/config";
import type { RegisterUserData, UserLoginData } from "./authentication.types";
// #end-section
// #function registerUser
/**
 * Registra un nuevo usuario en el sistema.
 * Valida los datos, realiza la petición POST al backend y retorna
 * la información del usuario registrado junto con su token de autenticación.
 *
 * @async
 * @param {RegisterUserData} registerUserData - Datos del usuario a registrar.
 * @returns {Promise<{user: any, token: string}>} Datos del usuario y token de autenticación.
 * @throws {Error} Si los datos son inválidos o la solicitud al backend falla.
 */
export const registerUser = async (registerUserData: RegisterUserData) => {
  // #step 1 - Validación de datos de registro
  // #variable validatedData - Datos validados y procesados del usuario
  const validatedData = validateRegisterUserData(registerUserData);
  // #end-variable
  // #end-step
  // #step 2 - Realizar petición POST a la API de registro
  // #variable response - Respuesta HTTP del servidor
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.REGISTER_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Para recibir cookies HttpOnly del backend
    body: JSON.stringify(validatedData),
  });
  // #end-variable
  // #end-step
  // #step 3 - Procesar y validar respuesta de la API
  // #variable responseData - Datos parseados de la respuesta del servidor
  const responseData = await response.json();
  // #end-variable

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || 'Registration failed');
  }
  // #end-step
  // #step 4 - Retornar datos del usuario y token
  return responseData.data; // {user, token}
  // #end-step
};
// #end-function
// #function loginUser
/**
 * Inicia sesión de un usuario en el sistema.
 * Valida las credenciales, realiza la petición POST al backend y retorna
 * la información del usuario junto con su token de autenticación.
 *
 * @async
 * @param {UserLoginData} loginUserData - Datos del usuario para iniciar sesión.
 * @returns {Promise<{user: any, token: string}>} Datos del usuario y token de autenticación.
 * @throws {Error} Si las credenciales son inválidas o la solicitud al backend falla.
 */
export const loginUser = async (loginUserData: UserLoginData) => {
  // #step 1 - Validación de datos de login
  // #variable validatedData - Datos validados y procesados del usuario
  const validatedData = validateLoginUserData(loginUserData);
  // #end-variable
  // #end-step
  // #step 2 - Realizar petición POST a la API de login
  // #variable response - Respuesta HTTP del servidor
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.LOGIN_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(validatedData),
  });
  // #end-variable
  // #end-step
  // #step 3 - Procesar y validar respuesta de la API
  // #variable responseData - Datos parseados de la respuesta del servidor
  const responseData = await response.json();
  // #end-variable

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error?.message || 'Login failed');
  }
  // #end-step
  // #step 4 - Retornar datos del usuario y token
  return responseData.data;
  // #end-step
};
// #end-function
// #function validateRegisterUserData
/**
 * Valida los datos necesarios para el registro de un usuario.
 * Verifica que los campos existan, cumplan con formatos válidos y
 * retorna los datos normalizados y procesados.
 * Soporta registro local (email/password) y mediante Google (token).
 *
 * @param {RegisterUserData} data - Datos del usuario a registrar.
 * @returns {RegisterUserData} Datos validados y procesados.
 * @throws {Error} Si los datos no son válidos o faltan campos requeridos.
 */
const validateRegisterUserData = (data: RegisterUserData): RegisterUserData => {
  // #step 1 - Validación de datos de registro (plataforma local)
  if (data.platform === 'local') {
    // #variable email, name, lastName, password, confirmPassword - Campos del formulario de registro local
    const { email, name, lastName, password, confirmPassword } = data;
    // #end-variable

    // Validar que todos los campos existan
    if (!email || !name || !lastName || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    // #variable processedEmail - Email validado y normalizado a minúsculas
    const processedEmail = validateAndProcessEmail(email);
    // #end-variable

    // #variable processedName - Nombre validado y capitalizado
    const processedName = validateAndProcessName(name);
    // #end-variable

    // #variable processedLastName - Apellido validado y capitalizado
    const processedLastName = validateAndProcessName(lastName);
    // #end-variable

    // Validar contraseña
    validatePassword(password);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Retornar datos procesados
    return {
      platform: 'local',
      email: processedEmail,
      name: processedName,
      lastName: processedLastName,
      password,
      confirmPassword
    };
  }
  // #end-step

  // #step 2 - Validación de datos de registro (plataforma Google)
  else if (data.platform === 'google') {
    // #variable email, name, lastName, token - Campos del registro mediante Google
    const { email, name, lastName, token } = data;
    // #end-variable

    // Validar que todos los campos existan
    if (!email || !name || !lastName || !token) {
      throw new Error('All fields are required');
    }

    // #variable processedEmail - Email validado y normalizado a minúsculas
    const processedEmail = validateAndProcessEmail(email);
    // #end-variable

    // #variable processedName - Nombre validado y capitalizado
    const processedName = validateAndProcessName(name);
    // #end-variable

    // #variable processedLastName - Apellido validado y capitalizado
    const processedLastName = validateAndProcessName(lastName);
    // #end-variable

    // Retornar datos procesados
    return {
      platform: 'google',
      email: processedEmail,
      name: processedName,
      lastName: processedLastName,
      token,
      imageUrl: data.imageUrl
    };
  }
  // #end-step

  throw new Error('Invalid platform');
};
// #end-function
// #function validateLoginUserData
/**
 * Valida y normaliza los datos de login.
 * NO realiza validaciones exhaustivas (eso lo hace react-hook-form en el frontend).
 * Solo verifica que los campos requeridos existan y normaliza el email.
 *
 * @param {UserLoginData} data - Datos del usuario para iniciar sesión.
 * @returns {UserLoginData} Datos validados y procesados.
 * @throws {Error} Si faltan campos requeridos.
 */
const validateLoginUserData = (data: UserLoginData): UserLoginData => {
  // #step 1 - Validación de datos de login (plataforma local)
  if (data.platform === 'local') {
    // #variable email, password - Credenciales del usuario para login local
    const { email, password } = data;
    // #end-variable

    // Validar que todos los campos existan
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Normalizar email a minúsculas
    const processedEmail = email.trim().toLowerCase();

    // Retornar datos procesados
    return {
      platform: 'local',
      email: processedEmail,
      password
    };
  }
  // #end-step

  // #step 2 - Validación de datos de login (plataforma Google)
  else if (data.platform === 'google') {
    // #variable email, platformToken - Datos de autenticación de Google
    const { email, platformToken } = data;
    // #end-variable

    // Validar que todos los campos existan
    if (!email || !platformToken) {
      throw new Error('Email and token are required');
    }

    // Normalizar email a minúsculas
    const processedEmail = email.trim().toLowerCase();

    // Retornar datos procesados
    return {
      platform: 'google',
      email: processedEmail,
      platformToken
    };
  }
  // #end-step

  throw new Error('Invalid platform');
};
// #end-function
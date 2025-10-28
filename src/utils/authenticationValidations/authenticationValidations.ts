/* src\utils\authenticationValidations\authenticationValidations.ts */
// #function validateAndProcessName
/**
 * Valida y procesa un nombre o apellido individual.
 * - Elimina espacios en blanco al inicio y final
 * - Valida longitud (2-50 caracteres)
 * - Solo permite letras y espacios
 * - Capitaliza la primera letra de cada palabra
 * - Elimina espacios múltiples
 * 
 * @param {string} value - Nombre o apellido a validar y procesar
 * @returns {string} Valor procesado y validado
 * @throws {Error} Si el valor no es válido
 */
export const validateAndProcessName = (value: string): string => {
  // Eliminar espacios al inicio y final
  const trimmedValue = value.trim();

  // Validar que no esté vacío después del trim
  if (!trimmedValue) {
    throw new Error('Name or lastName cannot be empty');
  }

  // Validar longitud
  const minLength = 2;
  const maxLength = 50;
  if (trimmedValue.length < minLength) {
    throw new Error(`Must be at least ${minLength} characters`);
  }
  if (trimmedValue.length > maxLength) {
    throw new Error(`Must not exceed ${maxLength} characters`);
  }

  // Validar que solo contenga letras y espacios
  // Permite letras con acentos y caracteres especiales de idiomas latinos
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!nameRegex.test(trimmedValue)) {
    throw new Error('Can only contain letters and spaces');
  }

  // Eliminar espacios múltiples y reemplazar por uno solo
  const normalizedValue = trimmedValue.replace(/\s+/g, ' ');

  // Capitalizar primera letra de cada palabra
  const processedValue = normalizedValue
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return processedValue;
};
// #end-function
// #function validateAndProcessEmail
/**
 * Valida y procesa una dirección de correo electrónico.
 * - Elimina espacios en blanco al inicio y final
 * - Convierte a minúsculas
 * - Valida formato de email usando regex estricto
 * - Valida longitud máxima
 * 
 * @param {string} email - Dirección de correo electrónico a validar
 * @returns {string} Email procesado y validado
 * @throws {Error} Si el email no es válido
 */
export const validateAndProcessEmail = (email: string): string => {
  // Eliminar espacios al inicio y final
  const trimmedEmail = email.trim();

  // Validar que no esté vacío
  if (!trimmedEmail) {
    throw new Error('Email cannot be empty');
  }

  // Convertir a minúsculas (los emails no distinguen mayúsculas/minúsculas)
  const normalizedEmail = trimmedEmail.toLowerCase();

  // Validar longitud máxima (estándar RFC 5321)
  const maxLength = 254;
  if (normalizedEmail.length > maxLength) {
    throw new Error(`Email must not exceed ${maxLength} characters`);
  }

  // Validar formato de email con regex estricto
  const emailRegex = /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_\-.'+])+([a-zA-Z0-9_\-.'+])@(?!-)(?!.*--)([a-zA-Z0-9.-])+(?<!\.)(\.[a-zA-Z]{2,6})$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Invalid email format');
  }

  return normalizedEmail;
};
// #end-function
// #function validatePassword
/**
 * Valida una contraseña según reglas de seguridad básicas.
 * - Longitud mínima de 8 caracteres
 * - Longitud máxima de 128 caracteres
 * - Al menos una letra
 * - Al menos un número
 * - No permite espacios en blanco
 * 
 * @param {string} password - Contraseña a validar
 * @returns {boolean} true si la contraseña es válida
 * @throws {Error} Si la contraseña no cumple con los requisitos
 */
export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const maxLength = 128;

  // Validar longitud mínima
  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters`);
  }

  // Validar longitud máxima
  if (password.length > maxLength) {
    throw new Error(`Password must not exceed ${maxLength} characters`);
  }

  // No permitir espacios en blanco
  if (/\s/.test(password)) {
    throw new Error('Password cannot contain spaces');
  }

  // Al menos una letra (mayúscula o minúscula)
  if (!/[a-zA-Z]/.test(password)) {
    throw new Error('Password must contain at least one letter');
  }

  // Al menos un número
  if (!/\d/.test(password)) {
    throw new Error('Password must contain at least one number');
  }

  return true;
};
// #end-function


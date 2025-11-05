// #function getInitials
/**
 * Obtiene las iniciales de un nombre completo
 * @param name - Nombre completo del usuario
 * @returns Iniciales en mayúsculas (máximo 2 caracteres)
 * @example
 * getInitials('Juan Pérez') // 'JP'
 * getInitials('María') // 'M'
 * getInitials('') // '?'
 */
export const getInitials = (name: string): string => {
  if (!name || name.trim() === '') return '?';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  
  // Tomar primera letra de la primera y última palabra
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
// #end-function
// #function truncateText
/**
 * Trunca un texto si excede la longitud máxima
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima permitida
 * @returns Texto truncado con '...' si es necesario
 * @example
 * truncateText('nombremuylargo@correo.com', 20) // 'nombremuylargo@co...'
 * truncateText('Juan', 20) // 'Juan'
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};
// #end-function
// #function buildFullUrl
/**
 * Construye una URL completa a partir de una URL relativa o absoluta
 * @param url - URL del recurso (puede ser relativa o absoluta)
 * @param baseUrl - URL base para concatenar (opcional)
 * @returns URL completa
 * @example
 * buildFullUrl('user.jpg', 'https://example.com/assets/') // 'https://example.com/assets/user.jpg'
 * buildFullUrl('https://example.com/avatar.jpg') // 'https://example.com/avatar.jpg'
 * buildFullUrl('/assets/user.jpg', 'https://example.com') // 'https://example.com/assets/user.jpg'
 */
export const buildFullUrl = (url: string, baseUrl?: string): string => {
  if (!url) return '';
  
  // Si ya es una URL absoluta (http/https/data), devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // Si no hay baseUrl, devolver la URL tal cual
  if (!baseUrl) return url;
  
  // Limpiar baseUrl (quitar slash final si existe)
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Limpiar url (agregar slash inicial si no existe)
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${cleanBaseUrl}${cleanUrl}`;
};
// #end-function
// #function isValidUrl
/**
 * Valida si una URL tiene un formato válido
 * @param url - URL a validar
 * @returns true si la URL es válida, false en caso contrario
 * @example
 * isValidUrl('https://example.com/image.jpg') // true
 * isValidUrl('not-a-url') // false
 * isValidUrl('') // false
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    // Si no es una URL absoluta, verificar si es una URL relativa válida
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};
// #end-function
// #function getUserDisplayText
/**
 * Obtiene el texto a mostrar del usuario según el modo de visualización
 * @param user - Datos del usuario
 * @param mode - Modo de visualización ('name' o 'email')
 * @param maxLength - Longitud máxima del texto (opcional)
 * @returns Texto a mostrar (truncado si es necesario)
 * @example
 * getUserDisplayText({ name: 'Juan Pérez', email: 'juan@example.com' }, 'name', 20)
 * // 'Juan Pérez'
 */
export const getUserDisplayText = (
  user: { name: string; email: string },
  mode: 'name' | 'email',
  maxLength?: number
): string => {
  const text = mode === 'name' ? user.name : user.email;
  return maxLength ? truncateText(text, maxLength) : text;
};
// #end-function
// #function getAvatarSrc
/**
 * Obtiene la URL final del avatar, con fallback al ícono por defecto
 * @param avatarUrl - URL del avatar del usuario (puede ser undefined)
 * @param defaultIcon - Ícono por defecto si no hay avatar
 * @param baseUrl - URL base para construir URLs relativas (opcional)
 * @returns URL del avatar o ícono por defecto
 * @example
 * getAvatarSrc('avatar.jpg', 'user.svg', 'https://example.com')
 * // 'https://example.com/avatar.jpg'
 * getAvatarSrc(undefined, 'user.svg')
 * // 'user.svg'
 */
export const getAvatarSrc = (
  avatarUrl: string | undefined,
  defaultIcon: string,
  baseUrl?: string
): string => {
  if (!avatarUrl) return buildFullUrl(defaultIcon, baseUrl);
  return buildFullUrl(avatarUrl, baseUrl);
};
// #end-function
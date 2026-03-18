// #function getInitials - Obtiene las iniciales de un nombre completo
/**
 * @description Obtiene las iniciales de un nombre completo.
 * @purpose Generar un placeholder visual para el avatar cuando el usuario no tiene imagen de perfil.
 * @context Utilizado por AppHeader para mostrar las iniciales del usuario en el avatar placeholder.
 * @param name nombre completo del usuario
 * @returns iniciales en mayúsculas (máximo 2 caracteres, '?' si el nombre está vacío)
 * @example
 * getInitials('Juan Pérez') // 'JP'
 * getInitials('María') // 'M'
 * getInitials('') // '?'
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
// #function truncateText - Trunca un texto si excede la longitud máxima permitida
/**
 * @description Trunca un texto si excede la longitud máxima permitida.
 * @purpose Evitar que textos largos rompan el layout del header.
 * @context Utilizado por getUserDisplayText para limitar el texto visible en AppHeader.
 * @param text texto a truncar
 * @param maxLength longitud máxima permitida
 * @returns texto truncado con '...' si supera el límite, texto original si no
 * @example
 * truncateText('nombremuylargo@correo.com', 20) // 'nombremuylargo@co...'
 * truncateText('Juan', 20) // 'Juan'
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};
// #end-function
// #function buildFullUrl - Construye una URL completa a partir de una URL relativa o absoluta
/**
 * @description Construye una URL completa a partir de una URL relativa o absoluta.
 * @purpose Normalizar URLs de recursos para que sean siempre absolutas y utilizables por el navegador.
 * @context Utilizado por getAvatarSrc para construir la URL del avatar del usuario en AppHeader.
 * @param url URL del recurso (relativa o absoluta)
 * @param baseUrl URL base para concatenar (opcional)
 * @returns URL completa construida
 * @example
 * buildFullUrl('user.jpg', 'https://example.com/assets/') // 'https://example.com/assets/user.jpg'
 * buildFullUrl('https://example.com/avatar.jpg') // 'https://example.com/avatar.jpg'
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
// #function isValidUrl - Valida si una cadena tiene un formato de URL válido
/**
 * @description Valida si una cadena tiene un formato de URL válido.
 * @purpose Prevenir que URLs malformadas sean enviadas al navegador o al servidor.
 * @context Utilizado como utilitario de validación dentro del módulo AppHeader.
 * @param url cadena a validar como URL
 * @returns true si la URL tiene formato válido, false en caso contrario
 * @example
 * isValidUrl('https://example.com/image.jpg') // true
 * isValidUrl('not-a-url') // false
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
// #function getUserDisplayText - Obtiene el texto del usuario según el modo de visualización
/**
 * @description Obtiene el texto a mostrar del usuario según el modo de visualización seleccionado.
 * @purpose Centralizar la lógica de selección y truncado del texto del usuario en el header.
 * @context Utilizado por AppHeader para determinar qué dato del usuario mostrar (nombre o email).
 * @param user datos del usuario con nombre y correo
 * @param mode modo de visualización ('name' o 'email')
 * @param maxLength longitud máxima del texto (opcional)
 * @returns texto del usuario, truncado si supera el máximo
 * @example
 * getUserDisplayText({ name: 'Juan Pérez', email: 'juan@example.com' }, 'name', 20) // 'Juan Pérez'
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
// #function getAvatarSrc - Obtiene la URL final del avatar con fallback al ícono por defecto
/**
 * @description Obtiene la URL final del avatar con fallback al ícono por defecto.
 * @purpose Garantizar que siempre haya una imagen válida para el avatar, incluso si el usuario no tiene una asignada.
 * @context Utilizado por AppHeader para resolver la imagen a mostrar en el avatar del usuario.
 * @param avatarUrl URL del avatar del usuario (puede ser undefined)
 * @param defaultIcon ícono por defecto si no hay avatar
 * @param baseUrl URL base para construir URLs relativas (opcional)
 * @returns URL del avatar si existe, o URL del ícono por defecto
 * @example
 * getAvatarSrc('avatar.jpg', 'user.svg', 'https://example.com') // 'https://example.com/avatar.jpg'
 * getAvatarSrc(undefined, 'user.svg') // 'user.svg'
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
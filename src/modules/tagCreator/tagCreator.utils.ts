/* src/modules/tagCreator/tagCreator.utils.ts */
// #section Imports
import type { TagConfiguration } from './tagCreator.types';
import { TAG_VALIDATION_RULES } from './tagCreator.config';
// #end-section
// #function validateTagConfiguration
/**
 * Valida una configuración de etiqueta.
 * 
 * @param config - Configuración a validar
 * @returns Array de errores (vacío si es válida)
 * 
 * @example
 * const errors = validateTagConfiguration(config);
 * if (errors.length > 0) {
 *   console.error('Errores:', errors);
 * }
 */
export function validateTagConfiguration(config: TagConfiguration): string[] {
  const errors: string[] = [];
  
  // Validar nombre
  if (!config.name || config.name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  } else if (config.name.length < TAG_VALIDATION_RULES.name.minLength) {
    errors.push(`El nombre debe tener al menos ${TAG_VALIDATION_RULES.name.minLength} caracteres`);
  } else if (config.name.length > TAG_VALIDATION_RULES.name.maxLength) {
    errors.push(`El nombre no puede superar ${TAG_VALIDATION_RULES.name.maxLength} caracteres`);
  } else if (!TAG_VALIDATION_RULES.name.pattern.test(config.name)) {
    errors.push('El nombre contiene caracteres no permitidos');
  }
  
  // Validar color de texto
  if (!TAG_VALIDATION_RULES.textColor.pattern.test(config.textColor)) {
    errors.push('El color de texto debe ser un código hexadecimal válido (ej: #3B82F6)');
  }
  
  // Validar color de fondo
  if (!TAG_VALIDATION_RULES.backgroundColor.pattern.test(config.backgroundColor)) {
    errors.push('El color de fondo debe ser un código hexadecimal válido (ej: #DBEAFE)');
  }
  
  return errors;
}
// #end-function
// #function isValidHexColor
/**
 * Verifica si un string es un color hexadecimal válido.
 * 
 * @param color - String a validar
 * @returns true si es válido
 * 
 * @example
 * isValidHexColor('#3B82F6') // true
 * isValidHexColor('#FF0')    // false (debe ser 6 dígitos)
 * isValidHexColor('blue')    // false
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
// #end-function
// #function getContrastColor
/**
 * Calcula un color de contraste (blanco o negro) basado en el fondo.
 * Útil para asegurar legibilidad.
 * 
 * @param backgroundColor - Color de fondo en hex
 * @returns '#000000' o '#FFFFFF' según mejor contraste
 * 
 * @example
 * getContrastColor('#3B82F6') // '#FFFFFF' (fondo oscuro → texto blanco)
 * getContrastColor('#DBEAFE') // '#000000' (fondo claro → texto negro)
 */
export function getContrastColor(backgroundColor: string): string {
  // Convertir hex a RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcular luminancia (fórmula estándar)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si es claro → texto negro, si es oscuro → texto blanco
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
// #end-function
// #function suggestBackgroundColor
/**
 * Sugiere un color de fondo complementario basado en el color de texto.
 * Crea una versión muy clara del color de texto.
 * 
 * @param textColor - Color de texto en hex
 * @returns Color de fondo sugerido en hex
 * 
 * @example
 * suggestBackgroundColor('#3B82F6') // '#DBEAFE' (azul claro)
 */
export function suggestBackgroundColor(textColor: string): string {
  // Convertir hex a RGB
  const hex = textColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Crear versión muy clara (85% hacia blanco)
  const lighten = (value: number) => Math.round(value + (255 - value) * 0.85);
  const newR = lighten(r);
  const newG = lighten(g);
  const newB = lighten(b);
  
  // Convertir de vuelta a hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`.toUpperCase();
}
// #end-function
// #function generateTagCSS
/**
 * Genera un objeto de estilos CSS para aplicar a un elemento.
 * Útil para renderizar la etiqueta con los estilos configurados.
 * 
 * @param config - Configuración de la etiqueta
 * @returns Objeto con propiedades CSS
 * 
 * @example
 * const styles = generateTagCSS(config);
 * <div style={styles}>...</div>
 */
export function generateTagCSS(config: TagConfiguration): React.CSSProperties {
  return {
    color: config.textColor,
    backgroundColor: config.backgroundColor,
    border: config.hasBorder ? `2px solid ${config.textColor}` : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    userSelect: 'none'
  };
}
// #end-function
// #function exportTagConfiguration
/**
 * Exporta la configuración como JSON formateado.
 * Útil para guardar en archivo o copiar al portapapeles.
 * 
 * @param config - Configuración a exportar
 * @param prettify - Si debe formatear el JSON (default: true)
 * @returns String JSON
 * 
 * @example
 * const json = exportTagConfiguration(config);
 * console.log(json);
 * // {
 * //   "name": "Vegetariano",
 * //   "textColor": "#10B981",
 * //   ...
 * // }
 */
export function exportTagConfiguration(
  config: TagConfiguration,
  prettify: boolean = true
): string {
  return prettify 
    ? JSON.stringify(config, null, 2)
    : JSON.stringify(config);
}
// #end-function
// #function importTagConfiguration
/**
 * Importa una configuración desde JSON.
 * Valida que tenga la estructura correcta.
 * 
 * @param jsonString - String JSON a importar
 * @returns Configuración parseada o null si es inválida
 * 
 * @example
 * const config = importTagConfiguration(jsonStr);
 * if (config) {
 *   setTagConfig(config);
 * }
 */
export function importTagConfiguration(jsonString: string): TagConfiguration | null {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validar estructura mínima
    if (
      typeof parsed === 'object' &&
      typeof parsed.name === 'string' &&
      typeof parsed.textColor === 'string' &&
      typeof parsed.backgroundColor === 'string' &&
      typeof parsed.hasBorder === 'boolean' &&
      ['small', 'medium', 'large'].includes(parsed.size)
    ) {
      return parsed as TagConfiguration;
    }
    
    return null;
  } catch {
    return null;
  }
}
// #end-function
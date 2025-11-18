/* src/modules/categoryCreator/categoryCreator.utils.ts */

// #section Imports
import type { CategoryConfiguration, GradientConfig } from './categoryCreator.types';
import { CATEGORY_VALIDATION_RULES } from './categoryCreator.config';
// #end-section

// #function validateCategoryConfiguration
/**
 * Valida una configuración de categoría.
 * 
 * @param config - Configuración a validar
 * @returns Array de errores (vacío si es válida)
 * 
 * @example
 * const errors = validateCategoryConfiguration(config);
 * if (errors.length > 0) {
 *   console.error('Errores:', errors);
 * }
 */
export function validateCategoryConfiguration(config: CategoryConfiguration): string[] {
  const errors: string[] = [];
  
  // Validar nombre
  if (!config.name || config.name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  } else if (config.name.length < CATEGORY_VALIDATION_RULES.name.minLength) {
    errors.push(`El nombre debe tener al menos ${CATEGORY_VALIDATION_RULES.name.minLength} caracteres`);
  } else if (config.name.length > CATEGORY_VALIDATION_RULES.name.maxLength) {
    errors.push(`El nombre no puede superar ${CATEGORY_VALIDATION_RULES.name.maxLength} caracteres`);
  } else if (!CATEGORY_VALIDATION_RULES.name.pattern.test(config.name)) {
    errors.push('El nombre contiene caracteres no permitidos');
  }
  
  // Validar descripción (opcional)
  if (config.description && config.description.length > CATEGORY_VALIDATION_RULES.description.maxLength) {
    errors.push(`La descripción no puede superar ${CATEGORY_VALIDATION_RULES.description.maxLength} caracteres`);
  }
  
  // Validar color de texto
  if (!CATEGORY_VALIDATION_RULES.textColor.pattern.test(config.textColor)) {
    errors.push('El color de texto debe ser un código hexadecimal válido (ej: #FFFFFF)');
  }
  
  // Validar color de fondo (si es sólido)
  if (config.backgroundMode === 'solid') {
    if (!CATEGORY_VALIDATION_RULES.backgroundColor.pattern.test(config.backgroundColor)) {
      errors.push('El color de fondo debe ser un código hexadecimal válido (ej: #3B82F6)');
    }
  }
  
  // Validar gradiente (si está en modo gradiente)
  if (config.backgroundMode === 'gradient' && config.gradient) {
    const { angle, colors } = config.gradient;
    
    // Validar ángulo
    if (angle < CATEGORY_VALIDATION_RULES.gradientAngle.min || angle > CATEGORY_VALIDATION_RULES.gradientAngle.max) {
      errors.push(`El ángulo debe estar entre ${CATEGORY_VALIDATION_RULES.gradientAngle.min} y ${CATEGORY_VALIDATION_RULES.gradientAngle.max}`);
    }
    
    // Validar cantidad de colores
    if (colors.length < CATEGORY_VALIDATION_RULES.gradientColors.minColors) {
      errors.push(`El gradiente debe tener al menos ${CATEGORY_VALIDATION_RULES.gradientColors.minColors} colores`);
    }
    if (colors.length > CATEGORY_VALIDATION_RULES.gradientColors.maxColors) {
      errors.push(`El gradiente no puede tener más de ${CATEGORY_VALIDATION_RULES.gradientColors.maxColors} colores`);
    }
    
    // Validar cada color
    colors.forEach((color, index) => {
      if (!CATEGORY_VALIDATION_RULES.backgroundColor.pattern.test(color)) {
        errors.push(`El color ${index + 1} del gradiente debe ser un código hexadecimal válido`);
      }
    });
  }
  
  return errors;
}
// #end-function

// #function isValidHexColor
/**
 * Valida si un string es un color hexadecimal válido.
 * 
 * @param color - Color a validar
 * @returns true si es válido
 * 
 * @example
 * isValidHexColor('#FF6B6B') // true
 * isValidHexColor('red') // false
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}
// #end-function

// #function generateGradientCSS
/**
 * Genera el CSS de un gradiente.
 * 
 * @param gradient - Configuración del gradiente
 * @returns String CSS del gradiente
 * 
 * @example
 * const css = generateGradientCSS({
 *   type: 'linear',
 *   angle: 135,
 *   colors: ['#FF6B6B', '#FFD93D']
 * });
 * // Returns: 'linear-gradient(135deg, #FF6B6B, #FFD93D)'
 */
export function generateGradientCSS(gradient: GradientConfig): string {
  const { type, angle, colors } = gradient;
  
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
  } else {
    return `radial-gradient(circle, ${colors.join(', ')})`;
  }
}
// #end-function

// #function generateBackgroundCSS
/**
 * Genera el CSS completo del background según la configuración.
 * 
 * @param config - Configuración de la categoría
 * @returns String CSS del background
 * 
 * @example
 * const css = generateBackgroundCSS(config);
 * // Returns: 'linear-gradient(135deg, #FF6B6B, #FFD93D)' o '#3B82F6'
 */
export function generateBackgroundCSS(config: CategoryConfiguration): string {
  if (config.backgroundMode === 'gradient' && config.gradient) {
    return generateGradientCSS(config.gradient);
  }
  return config.backgroundColor;
}
// #end-function

// #function getContrastColor
/**
 * Obtiene un color de contraste (blanco o negro) según el color de fondo.
 * Usa el algoritmo de luminancia relativa.
 * 
 * @param hexColor - Color hexadecimal
 * @returns '#000000' o '#FFFFFF'
 * 
 * @example
 * getContrastColor('#FF6B6B') // '#FFFFFF'
 * getContrastColor('#FFD93D') // '#000000'
 */
export function getContrastColor(hexColor: string): string {
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calcular luminancia relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si es claro, texto oscuro; si es oscuro, texto claro
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
// #end-function

// #function getContrastColorForGradient
/**
 * Obtiene un color de contraste para un gradiente.
 * Usa el primer color del gradiente como referencia.
 * 
 * @param gradient - Configuración del gradiente
 * @returns '#000000' o '#FFFFFF'
 */
export function getContrastColorForGradient(gradient: GradientConfig): string {
  return getContrastColor(gradient.colors[0]);
}
// #end-function

// #function exportCategoryConfiguration
/**
 * Exporta la configuración como JSON string.
 * Útil para guardar en base de datos.
 * 
 * @param config - Configuración a exportar
 * @returns JSON string
 */
export function exportCategoryConfiguration(config: CategoryConfiguration): string {
  return JSON.stringify(config, null, 2);
}
// #end-function

// #function importCategoryConfiguration
/**
 * Importa una configuración desde JSON string.
 * 
 * @param json - JSON string
 * @returns Configuración parseada o null si hay error
 */
export function importCategoryConfiguration(json: string): CategoryConfiguration | null {
  try {
    const config = JSON.parse(json) as CategoryConfiguration;
    const errors = validateCategoryConfiguration(config);
    return errors.length === 0 ? config : null;
  } catch {
    return null;
  }
}
// #end-function
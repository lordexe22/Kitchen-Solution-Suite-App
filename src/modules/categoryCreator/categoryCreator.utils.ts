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
    
    // Validar colores
    if (colors.length < CATEGORY_VALIDATION_RULES.gradientColors.minColors) {
      errors.push(`El gradiente debe tener al menos ${CATEGORY_VALIDATION_RULES.gradientColors.minColors} colores`);
    }
    
    if (colors.length > CATEGORY_VALIDATION_RULES.gradientColors.maxColors) {
      errors.push(`El gradiente no puede tener más de ${CATEGORY_VALIDATION_RULES.gradientColors.maxColors} colores`);
    }
    
    // Validar formato de cada color
    colors.forEach((color, index) => {
      if (!CATEGORY_VALIDATION_RULES.backgroundColor.pattern.test(color)) {
        errors.push(`El color ${index + 1} del gradiente no es válido`);
      }
    });
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

// #function generateGradientCSS
/**
 * Genera el CSS para un gradiente.
 * 
 * @param gradient - Configuración del gradiente
 * @returns String CSS del gradiente
 * 
 * @example
 * generateGradientCSS({
 *   type: 'linear',
 *   angle: 135,
 *   colors: ['#FF6B6B', '#FFD93D']
 * })
 * // Returns: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)'
 */
export function generateGradientCSS(gradient: GradientConfig): string {
  const { type, angle, colors } = gradient;
  
  if (type === 'linear') {
    // Calcular posiciones automáticas si no se especifican
    const colorStops = colors.map((color, i) => {
      const position = (i * (100 / (colors.length - 1))).toFixed(0);
      return `${color} ${position}%`;
    }).join(', ');
    
    return `linear-gradient(${angle}deg, ${colorStops})`;
  }
  
  if (type === 'radial') {
    const colorStops = colors.map((color, i) => {
      const position = (i * (100 / (colors.length - 1))).toFixed(0);
      return `${color} ${position}%`;
    }).join(', ');
    
    return `radial-gradient(circle, ${colorStops})`;
  }
  
  return '';
}
// #end-function

// #function generateBackgroundCSS
/**
 * Genera el CSS completo del fondo según la configuración.
 * 
 * @param config - Configuración de la categoría
 * @returns String CSS para aplicar al background
 */
export function generateBackgroundCSS(config: CategoryConfiguration): string {
  if (config.backgroundMode === 'solid') {
    return config.backgroundColor;
  }
  
  if (config.backgroundMode === 'gradient' && config.gradient) {
    return generateGradientCSS(config.gradient);
  }
  
  return config.backgroundColor;
}
// #end-function

// #function hexToRgb
/**
 * Convierte un color hexadecimal a RGB.
 * 
 * @param hex - Color en formato hexadecimal
 * @returns Objeto con valores r, g, b o null si es inválido
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
// #end-function

// #function getLuminance
/**
 * Calcula la luminancia relativa de un color RGB.
 * Usado para determinar contraste.
 * 
 * @param r - Valor red (0-255)
 * @param g - Valor green (0-255)
 * @param b - Valor blue (0-255)
 * @returns Luminancia (0-1)
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
// #end-function

// #function getContrastColor
/**
 * Calcula un color de contraste (blanco o negro) basado en el fondo.
 * Útil para asegurar legibilidad del texto.
 * 
 * @param backgroundColor - Color de fondo (hex)
 * @returns '#FFFFFF' o '#000000'
 * 
 * @example
 * getContrastColor('#3B82F6') // '#FFFFFF'
 * getContrastColor('#FFD93D') // '#000000'
 */
export function getContrastColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#FFFFFF';
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
// #end-function

// #function getContrastColorForGradient
/**
 * Calcula un color de contraste óptimo para un gradiente.
 * Promedia la luminancia de todos los colores.
 * 
 * @param colors - Array de colores del gradiente (hex)
 * @returns '#FFFFFF' o '#000000'
 */
export function getContrastColorForGradient(colors: string[]): string {
  const luminances = colors.map(color => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0.5;
    return getLuminance(rgb.r, rgb.g, rgb.b);
  });
  
  const avgLuminance = luminances.reduce((a, b) => a + b, 0) / luminances.length;
  return avgLuminance > 0.5 ? '#000000' : '#FFFFFF';
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
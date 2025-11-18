/* src/modules/categoryCreator/categoryCreator.config.ts */

// #section Imports
import type { CategoryConfiguration, GradientPreset } from './categoryCreator.types';
// #end-section

// #variable DEFAULT_CATEGORY_CONFIG
/**
 * Configuración por defecto de una categoría.
 */
export const DEFAULT_CATEGORY_CONFIG: CategoryConfiguration = {
  name: '',
  description: undefined,
  imageUrl: undefined,
  textColor: '#FFFFFF',
  backgroundMode: 'solid',
  backgroundColor: '#3B82F6',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#3B82F6', '#8B5CF6']
  }
};
// #end-variable

// #variable GRADIENT_PRESETS
/**
 * Presets de gradientes predefinidos populares.
 */
export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    name: 'Sunset',
    emoji: '🌅',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#FF6B6B', '#FFD93D']
    }
  },
  {
    name: 'Ocean',
    emoji: '🌊',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#667eea', '#764ba2']
    }
  },
  {
    name: 'Forest',
    emoji: '🌲',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#56ab2f', '#a8e063']
    }
  },
  {
    name: 'Fire',
    emoji: '🔥',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#f12711', '#f5af19']
    }
  },
  {
    name: 'Purple Dream',
    emoji: '💜',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#a8caba', '#5d4157']
    }
  },
  {
    name: 'Blue Sky',
    emoji: '🌌',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#00c6ff', '#0072ff']
    }
  },
  {
    name: 'Mint',
    emoji: '🍃',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#00b09b', '#96c93d']
    }
  },
  {
    name: 'Rose',
    emoji: '🌹',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#ed6ea0', '#ec8c69']
    }
  },
  {
    name: 'Peach',
    emoji: '🍑',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#ffecd2', '#fcb69f']
    }
  },
  {
    name: 'Moonlit',
    emoji: '🌙',
    gradient: {
      type: 'linear',
      angle: 135,
      colors: ['#0f2027', '#203a43', '#2c5364']
    }
  }
];
// #end-variable

// #variable ANGLE_PRESETS
/**
 * Presets de ángulos comunes para gradientes lineales.
 */
export const ANGLE_PRESETS = [
  { label: '→', value: 90, description: 'Horizontal derecha' },
  { label: '↘', value: 135, description: 'Diagonal abajo-derecha' },
  { label: '↓', value: 180, description: 'Vertical abajo' },
  { label: '↙', value: 225, description: 'Diagonal abajo-izquierda' },
  { label: '←', value: 270, description: 'Horizontal izquierda' },
  { label: '↖', value: 315, description: 'Diagonal arriba-izquierda' },
  { label: '↑', value: 0, description: 'Vertical arriba' },
  { label: '↗', value: 45, description: 'Diagonal arriba-derecha' }
];
// #end-variable

// #variable CATEGORY_VALIDATION_RULES
/**
 * Reglas de validación para la configuración de categorías.
 */
export const CATEGORY_VALIDATION_RULES = {
  name: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/, // Alfanumérico + espacios, guiones y guión bajo
  },
  description: {
    maxLength: 200,
  },
  textColor: {
    pattern: /^#[0-9A-Fa-f]{6}$/, // Hex color válido
  },
  backgroundColor: {
    pattern: /^#[0-9A-Fa-f]{6}$/, // Hex color válido
  },
  gradientColors: {
    minColors: 2,
    maxColors: 4,
  },
  gradientAngle: {
    min: 0,
    max: 360,
  }
};
// #end-variable

// #variable MODAL_TEXTS
/**
 * Textos por defecto del modal.
 */
export const MODAL_TEXTS = {
  title: 'Crear Categoría',
  confirmText: 'Crear',
  cancelText: 'Cancelar',
  nameLabel: 'Nombre',
  namePlaceholder: 'Ej: Pizzas',
  descriptionLabel: 'Descripción (opcional)',
  descriptionPlaceholder: 'Describe esta categoría...',
  imageLabel: 'Imagen (opcional)',
  imageUploadTab: 'Subir archivo',
  imageUrlTab: 'URL',
  imageSelectButton: 'Seleccionar imagen',
  imageHelperText: 'JPG, PNG, GIF, WEBP - Máximo 5MB',
  imageUrlPlaceholder: 'https://res.cloudinary.com/...',
  imageClearButton: 'Limpiar',
  textColorLabel: 'Color de texto',
  backgroundModeLabel: 'Tipo de fondo',
  solidTab: 'Sólido',
  gradientTab: 'Gradiente',
  backgroundColorLabel: 'Color de fondo',
  gradientTypeLabel: 'Tipo de gradiente',
  gradientAngleLabel: 'Dirección del gradiente',
  gradientColorsLabel: 'Colores del gradiente',
  addColorButton: '+ Agregar color',
  removeColorButton: 'Eliminar',
  presetsLabel: 'Presets rápidos',
  previewTitle: 'Vista Previa'
};
// #end-variable
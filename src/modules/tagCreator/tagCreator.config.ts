/* src/modules/tagCreator/tagCreator.config.ts */

// #section Imports
import type { TagConfiguration, TagSize } from './tagCreator.types';
// #end-section

// #variable DEFAULT_TAG_CONFIG
/**
 * Configuración por defecto de una etiqueta.
 */
export const DEFAULT_TAG_CONFIG: TagConfiguration = {
  name: '',
  textColor: '#3B82F6',
  backgroundColor: '#DBEAFE',
  icon: undefined,
  hasBorder: false,
  size: 'medium'
};
// #end-variable

// #variable TAG_SIZES
/**
 * Definición de tamaños de etiquetas.
 * Define padding, font-size (para texto e ícono) y border-radius.
 */
export const TAG_SIZES: Record<TagSize, {
  padding: string;
  fontSize: string;
  borderRadius: string;
}> = {
  small: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',      // Afecta al texto
    borderRadius: '0.25rem'
  },
  medium: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',     // Afecta al texto
    borderRadius: '0.375rem'
  },
  large: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',         // Afecta al texto
    borderRadius: '0.5rem'
  }
};
// #end-variable

// Preset colors removed - usando solo color pickers

// #variable PRESET_ICONS
/**
 * Íconos predefinidos comunes (emojis).
 * Organizados por categorías.
 */
export const PRESET_ICONS = {
  food: ['🍕', '🍔', '🌮', '🍜', '🍱', '🍰', '🥗', '🍖'],
  dietary: ['🌱', '🥬', '🌶️', '🚫', '🥛', '🍃', '🔥', '❄️'],
  symbols: ['⭐', '✨', '🔥', '💚', '💛', '💙', '💜', '🧡'],
  flags: ['🏴', '🏳️', '🚩', '🎌', '🏁', '🏴‍☠️', '🏳️‍🌈', '🇦🇷'],
  misc: ['✓', '✗', '◆', '●', '■', '▲', '♦', '♥']
};
// #end-variable

// #variable TAG_VALIDATION_RULES
/**
 * Reglas de validación para la configuración de etiquetas.
 */
export const TAG_VALIDATION_RULES = {
  name: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/, // Alfanumérico + espacios, guiones y guión bajo
  },
  textColor: {
    pattern: /^#[0-9A-Fa-f]{6}$/, // Hex color válido
  },
  backgroundColor: {
    pattern: /^#[0-9A-Fa-f]{6}$/, // Hex color válido
  }
};
// #end-variable

// #variable MODAL_TEXTS
/**
 * Textos por defecto del modal.
 */
export const MODAL_TEXTS = {
  title: 'Crear Etiqueta',
  confirmText: 'Crear',
  cancelText: 'Cancelar',
  nameLabel: 'Nombre',
  namePlaceholder: 'Ej: Vegetariano',
  textColorLabel: 'Color de texto',
  backgroundColorLabel: 'Color de fondo',
  iconLabel: 'Ícono (opcional)',
  iconPlaceholder: 'Selecciona un ícono o escribe un emoji',
  borderLabel: 'Agregar borde',
  sizeLabel: 'Tamaño',
  previewTitle: 'Vista Previa'
};
// #end-variable
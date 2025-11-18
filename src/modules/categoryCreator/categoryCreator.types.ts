/* src/modules/categoryCreator/categoryCreator.types.ts */

// #type GradientType
/**
 * Tipos de gradiente disponibles.
 */
export type GradientType = 'linear' | 'radial';
// #end-type

// #type GradientColors
/**
 * Array de 2 a 4 colores para el gradiente.
 */
export type GradientColors = 
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];
// #end-type

// #interface GradientConfig
/**
 * Configuración de un gradiente.
 */
export interface GradientConfig {
  /** Tipo de gradiente */
  type: GradientType;
  
  /** Ángulo (0-360, solo para linear) */
  angle: number;
  
  /** Array de colores (2-4) */
  colors: GradientColors;
}
// #end-interface

// #type BackgroundMode
/**
 * Modo de fondo: sólido o gradiente.
 */
export type BackgroundMode = 'solid' | 'gradient';
// #end-type

// #interface CategoryConfiguration
/**
 * Configuración completa de una categoría.
 * Este objeto es el resultado final del CategoryCreator.
 * 
 * @example
 * {
 *   name: "Pizzas",
 *   description: "Deliciosas pizzas artesanales",
 *   icon: "🍕",
 *   imageUrl: "https://res.cloudinary.com/...",
 *   textColor: "#FFFFFF",
 *   backgroundMode: "gradient",
 *   backgroundColor: "#FF6B6B",
 *   gradient: {
 *     type: "linear",
 *     angle: 135,
 *     colors: ["#FF6B6B", "#FFD93D"]
 *   }
 * }
 */
export interface CategoryConfiguration {
  /** Nombre de la categoría */
  name: string;
  
  /** Descripción opcional */
  description?: string;
  
  /** Ícono opcional (emoji) */
  icon?: string;
  
  /** URL de imagen (Cloudinary) - opcional */
  imageUrl?: string;
  
  /** Color del texto (hex) - siempre sólido para legibilidad */
  textColor: string;
  
  /** Modo de fondo: sólido o gradiente */
  backgroundMode: BackgroundMode;
  
  /** Color de fondo sólido (hex) - usado si backgroundMode === 'solid' */
  backgroundColor: string;
  
  /** Configuración de gradiente - usado si backgroundMode === 'gradient' */
  gradient?: GradientConfig;
}
// #end-interface

// #interface CategoryCreatorModalProps
/**
 * Props del componente CategoryCreatorModal.
 */
export interface CategoryCreatorModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  
  /** Callback para cerrar el modal */
  onClose: () => void;
  
  /** 
   * Callback cuando se confirma la creación.
   * Recibe la configuración completa de la categoría.
   */
  onConfirm: (config: CategoryConfiguration) => void;
  
  /** Configuración inicial (para edición) */
  initialConfig?: CategoryConfiguration;
  
  /** Título del modal */
  title?: string;
  
  /** Texto del botón de confirmar */
  confirmText?: string;
  
  /** Texto del botón de cancelar */
  cancelText?: string;
}
// #end-interface

// #interface UseCategoryCreatorReturn
/**
 * Retorno del hook useCategoryCreator.
 */
export interface UseCategoryCreatorReturn {
  /** Configuración actual */
  config: CategoryConfiguration;
  
  /** Actualizar nombre */
  setName: (name: string) => void;
  
  /** Actualizar descripción */
  setDescription: (description: string | undefined) => void;
  
  /** Actualizar ícono */
  setIcon: (icon: string | undefined) => void;
  
  /** Actualizar URL de imagen */
  setImageUrl: (url: string | undefined) => void;
  
  /** Actualizar color de texto */
  setTextColor: (color: string) => void;
  
  /** Cambiar modo de fondo (solid/gradient) */
  setBackgroundMode: (mode: BackgroundMode) => void;
  
  /** Actualizar color de fondo sólido */
  setBackgroundColor: (color: string) => void;
  
  /** Actualizar tipo de gradiente */
  setGradientType: (type: GradientType) => void;
  
  /** Actualizar ángulo del gradiente */
  setGradientAngle: (angle: number) => void;
  
  /** Actualizar colores del gradiente */
  setGradientColors: (colors: GradientColors) => void;
  
  /** Aplicar preset de gradiente */
  applyGradientPreset: (preset: GradientConfig) => void;
  
  /** Resetear a valores por defecto */
  reset: () => void;
  
  /** Validar si la configuración es válida */
  isValid: boolean;
  
  /** Errores de validación */
  errors: string[];
}
// #end-interface

// #interface GradientPreset
/**
 * Preset de gradiente predefinido.
 */
export interface GradientPreset {
  /** Nombre del preset */
  name: string;
  
  /** Emoji representativo */
  emoji: string;
  
  /** Configuración del gradiente */
  gradient: GradientConfig;
}
// #end-interface
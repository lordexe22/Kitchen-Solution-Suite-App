/* src/modules/tagCreator/tagCreator.types.ts */

// #type TagSize
/**
 * Tamaños disponibles para las etiquetas.
 */
export type TagSize = 'small' | 'medium' | 'large';
// #end-type

// #interface TagConfiguration
/**
 * Configuración completa de una etiqueta.
 * Este objeto es el resultado final del TagCreator.
 * 
 * @example
 * {
 *   name: "Vegetariano",
 *   textColor: "#10B981",
 *   backgroundColor: "#D1FAE5",
 *   icon: "🌱",
 *   hasBorder: true,
 *   size: "medium"
 * }
 */
export interface TagConfiguration {
  /** Nombre/texto de la etiqueta */
  name: string;
  
  /** Color del texto (hex) */
  textColor: string;
  
  /** Color de fondo (hex) */
  backgroundColor: string;
  
  /** Ícono opcional (emoji o URL) */
  icon?: string;
  
  /** Si tiene borde (usa el color del texto) */
  hasBorder: boolean;
  
  /** Tamaño de la etiqueta */
  size: TagSize;
}
// #end-interface

// #interface TagCreatorModalProps
/**
 * Props del componente TagCreatorModal.
 */
export interface TagCreatorModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  
  /** Callback para cerrar el modal */
  onClose: () => void;
  
  /** 
   * Callback cuando se confirma la creación.
   * Recibe la configuración completa de la etiqueta.
   */
  onConfirm: (config: TagConfiguration) => void;
  
  /** Configuración inicial (para edición) */
  initialConfig?: TagConfiguration;
  
  /** Título del modal */
  title?: string;
  
  /** Texto del botón de confirmar */
  confirmText?: string;
  
  /** Texto del botón de cancelar */
  cancelText?: string;
}
// #end-interface

// #interface TagPreviewProps
/**
 * Props del componente TagPreview.
 */
export interface TagPreviewProps {
  /** Configuración de la etiqueta a previsualizar */
  config: TagConfiguration;
  
  /** Mostrar título "Vista previa" */
  showTitle?: boolean;
}
// #end-interface

// #interface ColorPickerProps
/**
 * Props del componente ColorPicker.
 */
export interface ColorPickerProps {
  /** Color actual (hex) */
  value: string;
  
  /** Callback cuando cambia el color */
  onChange: (color: string) => void;
  
  /** Label del picker */
  label: string;
  
  /** Colores predefinidos sugeridos */
  presetColors?: string[];
}
// #end-interface

// #interface IconPickerProps
/**
 * Props del componente IconPicker.
 */
export interface IconPickerProps {
  /** Ícono actual */
  value?: string;
  
  /** Callback cuando cambia el ícono */
  onChange: (icon: string | undefined) => void;
  
  /** Label del picker */
  label: string;
  
  /** Íconos predefinidos sugeridos */
  presetIcons?: string[];
  
  /** Permitir input personalizado */
  allowCustom?: boolean;
}
// #end-interface

// #interface SizeSelectorProps
/**
 * Props del componente SizeSelector.
 */
export interface SizeSelectorProps {
  /** Tamaño actual */
  value: TagSize;
  
  /** Callback cuando cambia el tamaño */
  onChange: (size: TagSize) => void;
  
  /** Label del selector */
  label: string;
}
// #end-interface

// #interface UseTagCreatorReturn
/**
 * Retorno del hook useTagCreator.
 */
export interface UseTagCreatorReturn {
  /** Configuración actual */
  config: TagConfiguration;
  
  /** Actualizar nombre */
  setName: (name: string) => void;
  
  /** Actualizar color de texto */
  setTextColor: (color: string) => void;
  
  /** Actualizar color de fondo */
  setBackgroundColor: (color: string) => void;
  
  /** Actualizar ícono */
  setIcon: (icon: string | undefined) => void;
  
  /** Toggle borde */
  toggleBorder: () => void;
  
  /** Actualizar tamaño */
  setSize: (size: TagSize) => void;
  
  /** Resetear a valores por defecto */
  reset: () => void;
  
  /** Validar si la configuración es válida */
  isValid: boolean;
  
  /** Errores de validación */
  errors: string[];
}
// #end-interface
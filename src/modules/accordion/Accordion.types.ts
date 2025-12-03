/* src/modules/accordion/Accordion.types.ts */
import type React from 'react';
// #type IndicatorPosition
/**
 * Posición del indicador de expansión en el header.
 */
export type IndicatorPosition = 'start' | 'end';
// #end-type
// #interface AvatarProps
/**
 * Configuración del avatar/logo del acordeón.
 */
export interface AvatarProps {
  /** URL de la imagen a mostrar */
  src: string;
  /** Texto alternativo para la imagen */
  alt: string;
}
// #end-interface
// #interface RightButton
/**
 * Botón configurable para el banner derecho del header.
 */
export interface RightButton {
  /** Identificador único del botón */
  id: string;
  /** Texto del botón; opcional si es icon-only */
  label?: string;
  /** Ícono o emoji para el botón */
  icon?: React.ReactNode | string;
  /** Deshabilitar botón */
  disabled?: boolean;
  /** Tooltip del botón */
  tooltip?: string;
  /**
   * Callback al hacer clic en el botón.
   * @param args Contexto con id de botón y del acordeón
   */
  onClick: (args: { id: string; accordionId?: string }) => void;
  /** aria-label para accesibilidad si es icon-only */
  ariaLabel?: string;
  /** Clase CSS opcional para custom styling */
  className?: string;
}
// #end-interface
// #interface RightButtonsLayout
/**
 * Configuración de layout para el contenedor de botones derechos.
 */
export interface RightButtonsLayout {
  /** Número de filas para grid multi-fila. Defecto: 1 */
  rows?: number;
  /** Número de columnas explícito. Si no se define, se calcula automáticamente según rows y cantidad de items */
  cols?: number;
  /** Espaciado entre botones. Defecto: 8px */
  gap?: number | string;
  /** Alineación vertical de items. Defecto: 'center' */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justificación horizontal. Defecto: 'end' */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  /** Si true, permite wrap en layout flex. Defecto: true */
  wrap?: boolean;
}

export type RightButtonsOrder = {
  // Horizontal ordering: left-to-right or right-to-left
  horizontal?: 'ltr' | 'rtl';
  // Vertical ordering: top-to-bottom or bottom-to-top (for multi-row/column)
  vertical?: 'ttb' | 'btt';
  // Orientation priority: distribute primarily by rows or by columns
  orientation?: 'row' | 'column';
};
// #end-interface
// #interface DragHandleProps
/**
 * Props para habilitar drag & drop del acordeón.
 * El componente padre maneja la lógica de reordenamiento.
 */
export interface DragHandleProps {
  /** Label accesible para el control de arrastre */
  ariaLabel?: string;
  /**
   * Handler de inicio de drag.
   * El padre usa este callback para iniciar la lógica de reordenamiento.
   * @param {React.PointerEvent<HTMLDivElement>} e - Evento de puntero
   */
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
}
// #end-interface

// #type AccordionVariant
/**
 * Variantes visuales predefinidas para el acordeón.
 */
export type AccordionVariant = 'default' | 'compact' | 'elevated' | 'minimal' | 'outlined';
// #end-type

// #interface CustomStyles
/**
 * Estilos personalizables via props para override de variables CSS.
 */
export interface CustomStyles {
  /** Color de fondo del header */
  headerBg?: string;
  /** Color de fondo del header en hover */
  headerHoverBg?: string;
  /** Color de fondo del contenido */
  contentBg?: string;
  /** Color del borde */
  borderColor?: string;
  /** Radio del borde */
  borderRadius?: string;
  /** Color del texto del título */
  titleColor?: string;
  /** Color del texto del subtítulo */
  subtitleColor?: string;
}
// #end-interface

// #interface AccordionHeaderConfig
/**
 * Configuración completa del header del acordeón.
 */
export interface AccordionHeaderConfig {
  /** Título principal del acordeón */
  title: string;
  /** Subtítulo o descripción opcional bajo el título */
  subtitle?: string;
  /** Emoji decorativo al inicio del título */
  leadingEmoji?: string;
  /** Avatar/logo circular con fallback */
  avatar?: AvatarProps;
  /** Configuración del indicador de expansión */
  indicator?: {
    /** Posición del indicador en el header */
    position?: IndicatorPosition;
    /** Si true, oculta el indicador */
    hidden?: boolean;
    /** Grados de rotación al expandir (90 o 180) */
    rotationDegrees?: 90 | 180;
    /** Icono personalizado para el indicador */
    icon?: string;
  };
  /** Props del drag handle para reordenamiento */
  dragHandle?: DragHandleProps;
}
// #end-interface
// #interface AccordionProps
/**
 * Props del componente Accordion.
 */
export interface AccordionProps {
  /** ID único del acordeón (para aria-controls y callbacks) */
  id?: string;
  /** Configuración del header */
  header: AccordionHeaderConfig;  
  /** Contenido del acordeón */
  children: React.ReactNode;
  /** Estado inicial de expansión (solo modo no controlado) */
  defaultExpanded?: boolean;
  /** Estado de expansión controlado externamente (modo controlado) */
  isExpanded?: boolean;
  /** Si false, el acordeón no es expandible (modo bloque simple) */
  expandable?: boolean;
  /** Si true, mantiene el contenido montado cuando está colapsado */
  keepContentMounted?: boolean;
  /** Si true, deshabilita la interacción */
  disabled?: boolean;
  /** Duración de la transición de expansión en ms */
  transitionDurationMs?: number;
  /** Clase CSS adicional para el contenedor root */
  className?: string;
  /** Clase CSS adicional para el header */
  headerClassName?: string;
  /** Clase CSS adicional para el contenido */
  contentClassName?: string;
  /** Variante visual predefinida */
  variant?: AccordionVariant;
  /** Estilos personalizados para override de colores */
  customStyles?: CustomStyles;
  /**
   * Botones a la derecha del header.
   * Puede ser una lista de componentes React (máxima flexibilidad)
   * o una lista de configuraciones declarativas RightButton.
   */
  rightButtons?: Array<React.ReactNode | RightButton>;
  /** Configuración del layout de los botones derechos */
  rightButtonsLayout?: RightButtonsLayout;
  /** Variante visual para el contenedor de botones derechos */
  rightButtonsVariant?: string;
  /** Handler global adicional para cualquier click de botón derecho */
  onRightButtonClick?: (id: string, accordionId?: string) => void;
  /** Controlar el orden y la orientación de los botones derechos */
  rightButtonsOrder?: RightButtonsOrder;
  /** Clase CSS adicional para el contenedor de botones derechos */
  rightButtonsClassName?: string;
  /**
   * Callback ejecutado cuando cambia el estado de expansión.
   * @param isExpanded - Nuevo estado de expansión
   * @param id - ID del acordeón (si está definido)
   */
  onToggle?: (isExpanded: boolean, id?: string) => void;
}
// #end-interface

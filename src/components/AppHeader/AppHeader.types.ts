/* src\components\AppHeader\AppHeader.types.ts */

// #interface AppHeaderProps - Props del componente AppHeader
/**
 * @description
 * Props del componente AppHeader.
 *
 * @purpose
 * Definir el contrato de entrada del componente de cabecera principal de la aplicación.
 *
 * @context
 * Utilizado por el componente AppHeader que renderiza la barra superior con logo, nombre y acciones de sesión.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AppHeaderProps {
  // #v-field appLogoUrl - URL del logo de la aplicación
  /** URL del logo de la aplicación */
  appLogoUrl: string;
  // #end-v-field
  // #v-field appName - Nombre de la aplicación
  /** nombre o título de la aplicación */
  appName: string;
  // #end-v-field
  // #f-field onLogin - Callback al iniciar sesión
  /** callback ejecutado cuando el usuario hace clic en "Iniciar sesión / Registrarse" */
  onLogin: () => void;
  // #end-f-field
  // #f-field onLogout - Callback al cerrar sesión
  /** callback ejecutado cuando el usuario hace clic en "Cerrar sesión" */
  onLogout: () => void;
  // #end-f-field
}
// #end-interface

// #interface DropdownMenuItem - Ítem del menú desplegable del usuario
/**
 * @description
 * Representa un ítem dentro del menú desplegable asociado al usuario.
 *
 * @purpose
 * Definir la estructura de datos necesaria para construir el menú de usuario de forma dinámica.
 *
 * @context
 * Utilizado por el componente AppHeader y el hook useDropdown para renderizar las opciones del menú.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface DropdownMenuItem {
  // #v-field id - Identificador único del ítem
  /** identificador único del ítem */
  id: string;
  // #end-v-field
  // #v-field label - Texto del ítem
  /** texto a mostrar en el ítem */
  label: string;
  // #end-v-field
  // #v-field icon - Ícono del ítem
  /** ícono opcional del ítem */
  icon?: string;
  // #end-v-field
  // #v-field disabled - Estado de habilitación del ítem
  /** indica si el ítem está deshabilitado para interacción */
  disabled?: boolean;
  // #end-v-field
  // #f-field onClick - Callback al hacer clic
  /** callback ejecutado cuando el usuario hace clic en el ítem */
  onClick?: () => void;
  // #end-f-field
  // #v-field isDivider - Indica si es un separador visual
  /** indica si el ítem actúa como divisor visual en el menú */
  isDivider?: boolean;
  // #end-v-field
}
// #end-interface

// #interface DropdownState - Estado de apertura del dropdown
/**
 * @description
 * Representa el estado de visibilidad del menú desplegable.
 *
 * @purpose
 * Encapsular el estado de apertura/cierre del dropdown para su manejo centralizado.
 *
 * @context
 * Utilizado por el reducer del hook useDropdown dentro del componente AppHeader.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface DropdownState {
  // #v-field isOpen - Indica si el dropdown está abierto
  /** indica si el menú desplegable está actualmente visible */
  isOpen: boolean;
  // #end-v-field
}
// #end-interface

// #interface UseDropdownOptions - Opciones de configuración para el hook useDropdown
/**
 * @description
 * Opciones de configuración para personalizar el comportamiento del hook useDropdown.
 *
 * @purpose
 * Permitir configurar desde el componente consumidor cómo responde el dropdown a diferentes interacciones.
 *
 * @context
 * Utilizado al inicializar el hook useDropdown en el componente AppHeader.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface UseDropdownOptions {
  // #v-field closeOnClickOutside - Cerrar al hacer clic fuera
  /** cierra el dropdown al hacer clic fuera del área (por defecto: true) */
  closeOnClickOutside?: boolean;
  // #end-v-field
  // #v-field closeOnEscape - Cerrar al presionar ESC
  /** cierra el dropdown al presionar la tecla ESC (por defecto: true) */
  closeOnEscape?: boolean;
  // #end-v-field
  // #v-field closeOnItemClick - Cerrar al hacer clic en un ítem
  /** cierra el dropdown al seleccionar un ítem (por defecto: true) */
  closeOnItemClick?: boolean;
  // #end-v-field
  // #f-field onOpen - Callback al abrir el dropdown
  /** callback ejecutado cuando el dropdown se abre */
  onOpen?: () => void;
  // #end-f-field
  // #f-field onClose - Callback al cerrar el dropdown
  /** callback ejecutado cuando el dropdown se cierra */
  onClose?: () => void;
  // #end-f-field
}
// #end-interface

// #interface UseDropdownReturn - Valor retornado por el hook useDropdown
/**
 * @description
 * Contrato de retorno del hook useDropdown.
 *
 * @purpose
 * Exponer las acciones y el estado necesarios para controlar un menú desplegable desde un componente.
 *
 * @context
 * Retornado por el hook useDropdown y consumido por el componente AppHeader.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface UseDropdownReturn {
  // #v-field isOpen - Estado actual del dropdown
  /** indica si el menú desplegable está actualmente visible */
  isOpen: boolean;
  // #end-v-field
  // #f-field open - Abre el dropdown
  /** abre el menú desplegable */
  open: () => void;
  // #end-f-field
  // #f-field close - Cierra el dropdown
  /** cierra el menú desplegable */
  close: () => void;
  // #end-f-field
  // #f-field toggle - Alterna el estado del dropdown
  /** alterna entre abierto y cerrado el menú desplegable */
  toggle: () => void;
  // #end-f-field
  // #v-field dropdownRef - Ref al elemento del dropdown
  /** referencia al elemento DOM del dropdown para detectar clicks externos */
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  // #end-v-field
  // #f-field handleItemClick - Maneja el clic en un ítem
  /** maneja el evento de clic sobre un ítem del dropdown */
  handleItemClick: (onClick?: () => void) => void;
  // #end-f-field
}
// #end-interface

// #type UserDisplayMode - Modo de visualización del usuario en el header
/**
 * @description
 * Opciones de visualización de la información del usuario en el encabezado.
 *
 * @purpose
 * Controlar qué dato del usuario se muestra en la interfaz según la preferencia del contexto.
 *
 * @context
 * Utilizado por el componente AppHeader para decidir qué dato mostrar en el área del usuario.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type UserDisplayMode = 'name' | 'email';
// #end-type

// #type DropdownAction - Acciones del reducer del dropdown
/**
 * @description
 * Unión discriminada de acciones disponibles para el reducer del dropdown.
 *
 * @purpose
 * Tipar las acciones del reducer del hook useDropdown para garantizar exhaustividad y seguridad de tipos.
 *
 * @context
 * Utilizado por el useReducer del hook useDropdown dentro del componente AppHeader.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type DropdownAction =
  | { type: 'OPEN_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'TOGGLE_DROPDOWN' };
// #end-type

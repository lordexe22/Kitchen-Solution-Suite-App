/* src\components\AppHeader\AppHeader.types.ts */
// #interface AppHeaderProps
/**
 * Props del componente AppHeader
 */
export interface AppHeaderProps {
  /** URL del logo de la aplicación */
  appLogoUrl: string;
  /** Nombre/título de la aplicación */
  appName: string;
  /** Callback cuando se hace clic en "Iniciar sesión / Registrarse" */
  onLogin: () => void;
  /** Callback cuando se hace clic en "Cerrar sesión" */
  onLogout: () => void;
}
// #end-interface
// #interface DropdownMenuItem
/**
 * Representa un item del menú desplegable del usuario
 */
export interface DropdownMenuItem {
  /** Identificador único del item */
  id: string;
  /** Texto a mostrar */
  label: string;
  /** Ícono del item (opcional) */
  icon?: string;
  /** Si el item está deshabilitado */
  disabled?: boolean;
  /** Callback cuando se hace clic en el item */
  onClick?: () => void;
  /** Si el item es un divisor (separador visual) */
  isDivider?: boolean;
}
// #end-interface
// #interface DropdownState
/**
 * Estado del dropdown (abierto/cerrado)
 */
export interface DropdownState {
  isOpen: boolean;
}
// #end-interface
// #interface UseDropdownOptions
/**
 * Opciones de configuración para el hook useDropdown
 */
export interface UseDropdownOptions {
  /** Cerrar dropdown al hacer clic fuera (default: true) */
  closeOnClickOutside?: boolean;
  /** Cerrar dropdown al presionar ESC (default: true) */
  closeOnEscape?: boolean;
  /** Cerrar dropdown al hacer clic en un item (default: true) */
  closeOnItemClick?: boolean;
  /** Callback ejecutado cuando se abre el dropdown */
  onOpen?: () => void;
  /** Callback ejecutado cuando se cierra el dropdown */
  onClose?: () => void;
}
// #end-interface
// #interface UseDropdownReturn
/**
 * Valor retornado por el hook useDropdown
 */
export interface UseDropdownReturn {
  /** Estado actual del dropdown (abierto/cerrado) */
  isOpen: boolean;
  /** Función para abrir el dropdown */
  open: () => void;
  /** Función para cerrar el dropdown */
  close: () => void;
  /** Función para alternar el estado del dropdown */
  toggle: () => void;
  /** Ref al elemento del dropdown (para detectar clicks fuera) */
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  /** Función para manejar click en un item del dropdown */
  handleItemClick: (onClick?: () => void) => void;
}
// #end-interface
// #type UserDisplayMode
/**
 * Modo de visualización de la información del usuario
 * - 'name': Mostrar nombre del usuario
 * - 'email': Mostrar email del usuario
 */
export type UserDisplayMode = 'name' | 'email';
// #end-type
// #type DropdownAction
/**
 * Acciones disponibles para el reducer del dropdown
 */
export type DropdownAction =
  | { type: 'OPEN_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'TOGGLE_DROPDOWN' };
// #end-type

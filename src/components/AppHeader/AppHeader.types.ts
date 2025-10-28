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
// #type DropdownState
/**
 * Estado del dropdown (abierto/cerrado)
 */
export type DropdownState = {
  isOpen: boolean;
};
// #end-type
// #type UserDisplayMode
/**
 * Modo de visualización de la información del usuario
 * - 'name': Mostrar nombre del usuario
 * - 'email': Mostrar email del usuario
 */
export type UserDisplayMode = 'name' | 'email';
// #end-type
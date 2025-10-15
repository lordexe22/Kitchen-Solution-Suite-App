/* src\components\AppHeader\AppHeader.types.ts */
// #interface AppHeaderUser
/**
 * Representa la información simplificada del usuario para mostrar en el header
 */
export interface AppHeaderUser {
  /** Nombre completo o nombre de usuario */
  name: string;
  /** Dirección de correo electrónico */
  email: string;
  /** URL de la imagen de perfil (opcional) */
  avatarUrl?: string;
}
// #end-interface
// #interface AppHeaderProps
/**
 * Props del componente AppHeader
 */
export interface AppHeaderProps {
  /** URL del logo de la aplicación */
  appLogoUrl: string;
  /** Nombre/título de la aplicación */
  appName: string;
  /** Usuario actual (null si no está autenticado) */
  user: AppHeaderUser | null;
  /** Callback cuando se hace clic en "Iniciar sesión / Registrarse" */
  onLoginClick: () => void;
  /** Callback cuando se hace clic en "Cerrar sesión" */
  onLogout: () => void;
  /** Callback cuando se hace clic en el botón de notificaciones (botón separado) */
  onNotificationsClick?: () => void;
  /** Callback cuando se hace clic en "Mi Perfil" (opcional - deshabilitado por defecto) */
  onProfileClick?: () => void;
  /** Callback cuando se hace clic en "Configuración" (opcional - deshabilitado por defecto) */
  onSettingsClick?: () => void;
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
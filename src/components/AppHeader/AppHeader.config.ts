import type { DropdownMenuItem, UserDisplayMode } from './AppHeader.types';

// #section Textos por defecto
/**
 * Textos por defecto del AppHeader
 */
export const APP_HEADER_TEXTS = {
  loginButton: 'Ingresar',
  logoutButton: 'Cerrar sesión',
  profileMenu: 'Mi perfil',
  settingsMenu: 'Configuración',
  notificationsButton: 'Notificaciones',
} as const;
// #end-section

// #section Íconos por defecto
/**
 * URLs/símbolos de íconos por defecto
 */
export const APP_HEADER_ICONS = {
  defaultUserIcon: 'user.svg',
  notificationIcon: '🔔',
  profileIcon: '👤',
  settingsIcon: '⚙️',
  logoutIcon: '🚪',
  dropdownArrow: '▼',
} as const;
// #end-section

// #section Configuración del menú desplegable
/**
 * Función para crear los items del dropdown del usuario
 * @param callbacks - Callbacks para cada acción del menú
 */
export const createDropdownMenuItems = (callbacks: {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout: () => void;
}): DropdownMenuItem[] => [
  {
    id: 'profile',
    label: APP_HEADER_TEXTS.profileMenu,
    icon: APP_HEADER_ICONS.profileIcon,
    disabled: !callbacks.onProfileClick, // Deshabilitado si no hay callback
    onClick: callbacks.onProfileClick,
  },
  {
    id: 'settings',
    label: APP_HEADER_TEXTS.settingsMenu,
    icon: APP_HEADER_ICONS.settingsIcon,
    disabled: !callbacks.onSettingsClick, // Deshabilitado si no hay callback
    onClick: callbacks.onSettingsClick,
  },
  {
    id: 'divider-1',
    label: '',
    isDivider: true, // Separador visual
  },
  {
    id: 'logout',
    label: APP_HEADER_TEXTS.logoutButton,
    icon: APP_HEADER_ICONS.logoutIcon,
    disabled: false,
    onClick: callbacks.onLogout,
  },
];
// #end-section

// #section Opciones de configuración visual
/**
 * Opciones de configuración visual del AppHeader
 */
export const APP_HEADER_CONFIG = {
  /** Modo de visualización del usuario (nombre o email) */
  userDisplayMode: 'name' as UserDisplayMode,
  /** Cerrar el dropdown automáticamente al hacer clic en un item */
  closeDropdownOnItemClick: true,
  /** Mostrar ícono de flecha en el botón del dropdown */
  showDropdownArrow: true,
  /** Mostrar email debajo del nombre en el dropdown */
  showEmailInDropdown: true,
} as const;
// #end-section
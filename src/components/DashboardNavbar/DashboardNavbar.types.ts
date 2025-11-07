// src/components/DashboardNavbar/DashboardNavbar.types.ts

/**
 * Representa un item de navegación en el sidebar
 */
export interface NavItem {
  /** Identificador único del item */
  id: string;
  /** Texto a mostrar */
  label: string;
  /** Ícono del item (emoji o string) */
  icon: string;
  /** Ruta a la que navega */
  path: string;
}
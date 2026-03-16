/* src/components/DashboardNavbar/DashboardNavbar.types.ts */

// #interface NavItem - Ítem de navegación del sidebar del dashboard
/**
 * @description
 * Representa un elemento de navegación dentro del sidebar del dashboard.
 *
 * @purpose
 * Definir la estructura de datos de los ítems de navegación para construir el menú lateral de forma dinámica.
 *
 * @context
 * Utilizado por el componente DashboardNavbar para renderizar la estructura de navegación del panel.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface NavItem {
  // #v-field id - Identificador único del ítem
  /** identificador único del ítem de navegación */
  id: string;
  // #end-v-field
  // #v-field label - Texto visible del ítem
  /** texto a mostrar en el ítem de navegación */
  label: string;
  // #end-v-field
  // #v-field icon - Ícono representativo del ítem
  /** ícono del ítem (emoji o string) */
  icon: string;
  // #end-v-field
  // #v-field path - Ruta de navegación
  /** ruta a la que navega el ítem (opcional si tiene hijos) */
  path?: string;
  // #end-v-field
  // #v-field children - Sub-ítems del ítem de navegación
  /** sub-ítems para mostrar en un submenú o acordeón */
  children?: NavItem[];
  // #end-v-field
}
// #end-interface
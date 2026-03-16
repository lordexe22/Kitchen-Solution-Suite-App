/* src/store/Toast/Toast.types.ts */

// #type ToastType - Tipos de notificación disponibles en el sistema
/**
 * @description
 * Categorías de notificación visual disponibles en el sistema de toasts.
 *
 * @purpose
 * Tipificar el tipo de notificación para aplicar estilos y comportamientos diferenciados.
 *
 * @context
 * Utilizado por el store de toasts y los componentes de notificación del sistema.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';
// #end-type

// #interface Toast - Estructura de una notificación individual
/**
 * @description
 * Representa una notificación individual dentro del sistema de toasts.
 *
 * @purpose
 * Definir el contrato de datos mínimo para un toast activo en la interfaz.
 *
 * @context
 * Utilizado por el ToastStore y los componentes visuales que renderizan notificaciones.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface Toast {
  // #v-field id - Identificador único del toast
  /** identificador único generado en el momento de creación */
  id: string;
  // #end-v-field
  // #v-field type - Categoría visual del toast
  /** categoría visual que determina el estilo y el ícono */
  type: ToastType;
  // #end-v-field
  // #v-field message - Texto a mostrar al usuario
  /** mensaje a mostrar al usuario */
  message: string;
  // #end-v-field
  // #v-field duration - Tiempo de vida del toast en milisegundos
  /** duración en ms antes de auto-cerrar (0 = no auto-cerrar) */
  duration?: number;
  // #end-v-field
}
// #end-interface

// #interface ToastStore - Store de Zustand para gestionar toasts globales
/**
 * @description
 * Define el estado y las acciones del store global de notificaciones toast.
 *
 * @purpose
 * Centralizar la gestión de notificaciones transitorias del sistema en un único punto de control.
 *
 * @context
 * Utilizado como store de Zustand en componentes y servicios que necesitan emitir notificaciones al usuario.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface ToastStore {
  // #v-field toasts - Lista de toasts activos
  /** lista de notificaciones activas */
  toasts: Toast[];
  // #end-v-field
  // #f-field addToast - Agrega una nueva notificación
  /** agrega una nueva notificación al sistema */
  addToast: (toast: Omit<Toast, 'id'>) => void;
  // #end-f-field
  // #f-field removeToast - Elimina una notificación por id
  /** elimina una notificación activa por su identificador */
  removeToast: (id: string) => void;
  // #end-f-field
  // #f-field clearAll - Limpia todas las notificaciones activas
  /** elimina todas las notificaciones activas */
  clearAll: () => void;
  // #end-f-field
  // #f-field success - Emite una notificación de éxito
  /** emite un toast de éxito con mensaje y duración opcional */
  success: (message: string, duration?: number) => void;
  // #end-f-field
  // #f-field error - Emite una notificación de error
  /** emite un toast de error con mensaje y duración opcional */
  error: (message: string, duration?: number) => void;
  // #end-f-field
  // #f-field warning - Emite una notificación de advertencia
  /** emite un toast de advertencia con mensaje y duración opcional */
  warning: (message: string, duration?: number) => void;
  // #end-f-field
  // #f-field info - Emite una notificación informativa
  /** emite un toast informativo con mensaje y duración opcional */
  info: (message: string, duration?: number) => void;
  // #end-f-field
}
// #end-interface

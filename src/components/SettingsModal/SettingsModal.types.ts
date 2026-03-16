/* src/components/SettingsModal/SettingsModal.types.ts */

// #interface SettingsModalProps - Props del componente SettingsModal
/**
 * @description
 * Props recibidas por el componente modal de configuración de usuario.
 *
 * @purpose
 * Permitir al componente padre controlar la visibilidad del modal de configuración
 * y reaccionar a su cierre.
 *
 * @context
 * Utilizado por el componente SettingsModal, montado desde el header del dashboard.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface SettingsModalProps {
  // #v-field isOpen - indica si el modal está visible
  /** indica si el modal debe renderizarse y estar visible */
  isOpen: boolean;
  // #end-v-field

  // #f-field onClose - callback para cerrar el modal
  /** callback invocado para cerrar el modal */
  onClose: () => void;
  // #end-f-field
}
// #end-interface

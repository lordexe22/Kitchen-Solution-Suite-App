/* kitchen-solutions-suite-app\src\components\ServerErrorBanner\ServerErrorBanner.types.ts */

// #interface ServerErrorBannerProps - Props del componente ServerErrorBanner
/**
 * @description
 * Props del componente ServerErrorBanner.
 *
 * @purpose
 * Definir el contrato de entrada del componente que muestra errores provenientes del servidor.
 *
 * @context
 * Utilizado por el componente ServerErrorBanner para renderizar mensajes de error de red o servidor.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface ServerErrorBannerProps {
  // #v-field message - Mensaje de error a mostrar
  /** mensaje de error a mostrar en el banner */
  message: string | null;
  // #end-v-field
  // #f-field onClose - Callback al cerrar el banner
  /** callback ejecutado cuando el usuario cierra el banner */
  onClose: () => void;
  // #end-f-field
  // #v-field autoCloseDelay - Tiempo en ms antes del cierre automático
  /** tiempo en milisegundos antes de cerrar automáticamente el banner */
  autoCloseDelay?: number;
  // #end-v-field
}
// #end-interface
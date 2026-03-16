/* src/components/AuthLoginModalWindow/AuthLoginModalWindow.types.ts */

// #interface LoginFormData - Campos del formulario de inicio de sesión
/**
 * @description
 * Estructura de datos del formulario de inicio de sesión con credenciales locales.
 *
 * @purpose
 * Tipar los campos controlados por react-hook-form en el formulario de login.
 *
 * @context
 * Utilizado exclusivamente por el componente AuthLoginModalWindow para validar y enviar datos de login.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface LoginFormData {
  // #v-field email - correo electrónico del usuario
  /** correo electrónico ingresado por el usuario */
  email: string;
  // #end-v-field
  // #v-field password - contraseña del usuario
  /** contraseña ingresada por el usuario */
  password: string;
  // #end-v-field
}
// #end-interface
// #interface AuthLoginModalWindowProp - Props del componente AuthLoginModalWindow
/**
 * @description
 * Props recibidas por el componente modal de inicio de sesión.
 *
 * @purpose
 * Permitir al componente padre controlar el cierre del modal de login.
 *
 * @context
 * Utilizado por el componente AuthLoginModalWindow, montado desde la página principal o el header.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AuthLoginModalWindowProp {
  // #f-field onCloseModal - callback para cerrar el modal
  /** callback invocado para cerrar el modal */
  onCloseModal: () => void;
  // #end-f-field
}
// #end-interface

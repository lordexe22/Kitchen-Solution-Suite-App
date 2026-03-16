/* src/components/AuthRegisterModalWindow/AuthRegisterModalWindow.types.ts */

// #interface RegisterFormData - Campos del formulario de registro de usuario
/**
 * @description
 * Estructura de datos del formulario de registro de un nuevo usuario.
 *
 * @purpose
 * Tipar los campos controlados por react-hook-form en el formulario de registro.
 *
 * @context
 * Utilizado exclusivamente por el componente AuthRegisterModalWindow para validar y enviar datos de registro.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface RegisterFormData {
  // #v-field firstName - nombre de pila del usuario
  /** nombre de pila ingresado por el usuario */
  firstName: string;
  // #end-v-field

  // #v-field lastName - apellido del usuario
  /** apellido ingresado por el usuario */
  lastName: string;
  // #end-v-field

  // #v-field email - correo electrónico del usuario
  /** correo electrónico ingresado por el usuario */
  email: string;
  // #end-v-field

  // #v-field password - contraseña del usuario
  /** contraseña ingresada por el usuario */
  password: string;
  // #end-v-field

  // #v-field confirmPassword - confirmación de contraseña
  /** confirmación de la contraseña para validar coincidencia */
  confirmPassword: string;
  // #end-v-field
}
// #end-interface

// #interface AuthRegisterModalWindowProp - Props del componente AuthRegisterModalWindow
/**
 * @description
 * Props recibidas por el componente modal de registro de usuario.
 *
 * @purpose
 * Permitir al componente padre controlar el cierre del modal de registro.
 *
 * @context
 * Utilizado por el componente AuthRegisterModalWindow, montado desde la página principal o el header.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface AuthRegisterModalWindowProp {
  // #f-field onCloseModal - callback para cerrar el modal
  /** callback invocado para cerrar el modal */
  onCloseModal: () => void;
  // #end-f-field
}
// #end-interface

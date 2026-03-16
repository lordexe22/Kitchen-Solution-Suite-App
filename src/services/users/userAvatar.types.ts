/* src/services/users/userAvatar.types.ts */

// #interface UserAvatarResponse - Respuesta de los endpoints de avatar de usuario
/**
 * @description
 * Estructura de respuesta del servidor al subir o eliminar el avatar del usuario.
 *
 * @purpose
 * Tipar la respuesta de los endpoints de gestión de avatar para actualizar el store del usuario.
 *
 * @context
 * Utilizado por las funciones uploadUserAvatar y deleteUserAvatar del servicio userAvatar.
 *
 * @since 1.0.0
 *
 * @author Walter Ezequiel Puig
 */
export interface UserAvatarResponse {
  // #v-field user - datos actualizados del usuario
  /** datos del usuario tras la operación sobre el avatar */
  user: {
    /** identificador único del usuario */
    id: number;
    /** correo electrónico del usuario */
    email: string;
    /** nombre de pila del usuario */
    firstName: string;
    /** apellido del usuario */
    lastName: string;
    /** URL de la imagen de perfil o null si no tiene avatar */
    imageUrl: string | null;
  };
  // #end-v-field
  // #v-field cloudinary - datos del recurso en Cloudinary (opcional)
  /** información del recurso almacenado en Cloudinary; presente solo al subir una imagen */
  cloudinary?: {
    /** identificador público del recurso en Cloudinary */
    publicId: string;
    /** URL pública de la imagen en Cloudinary */
    url: string;
  };
  // #end-v-field
}
// #end-interface

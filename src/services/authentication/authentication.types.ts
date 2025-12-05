/* src\services\authentication\authentication.types.ts */
/* src\services\authentication\authentication.types.ts */
// #type RegisterUserData
/**
 * Representa los datos necesarios para registrar un usuario.
 * Puede provenir de un registro local o de Google.
 */
export type RegisterUserData =
  | {
      /** Plataforma de registro. */
      platformName: 'local';
      /** Nombre del usuario. */
      firstName: string;
      /** Apellido del usuario. */
      lastName: string;
      /** Dirección de correo electrónico. */
      email: string;
      /** Contraseña elegida por el usuario. */
      password: string;
      /** URL de la imagen (siempre null para local). */
      imageUrl: null;
      /** Token de plataforma (siempre null para local). */
      platformToken: null;
    }
  | {
      /** Plataforma de registro. */
      platformName: 'google';
      /** Nombre del usuario. */
      firstName: string;
      /** Apellido del usuario. */
      lastName: string;
      /** Dirección de correo electrónico. */
      email: string;
      /** Contraseña (siempre null para Google). */
      password: null;
      /** URL de la foto de perfil. */
      imageUrl: string;
      /** Token de autenticación de Google. */
      platformToken: string;
    };
// #end-type
// #type UserLoginData
/**
 * Representa los datos necesarios para iniciar sesión.
 * Puede provenir de un inicio de sesión local o de Google.
 */
export type UserLoginData =
  | {
      /** Plataforma de inicio de sesión. */
      platformName: 'local';
      /** Dirección de correo electrónico. */
      email: string;
      /** Contraseña del usuario. */
      password: string;
    }
  | {
      /** Plataforma de inicio de sesión. */
      platformName: 'google';
      /** Dirección de correo electrónico. */
      email: string;
      /** Token de autenticación de Google. */
      platformToken: string;
    };
// #end-type

// #type UserResponse
/**
 * Respuesta del servidor al registrar o autenticar un usuario.
 */
export interface UserResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string | null;
    type: string;
    state: string;
  };
}
// #end-type
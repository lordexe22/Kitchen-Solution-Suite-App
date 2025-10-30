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
      /** Dirección de correo electrónico. */
      email: string;
      /** Nombre del usuario. */
      name: string;
      /** Apellido del usuario. */
      lastName: string;
      /** Contraseña elegida por el usuario. */
      password: string;
      /** Confirmación de la contraseña. */
      confirmPassword: string;
    }
  | {
      /** Plataforma de registro. */
      platformName: 'google';
      /** Token de autenticación de Google. */
      token: string;
      /** Nombre del usuario. */
      name: string;
      /** Apellido del usuario. */
      lastName: string;
      /** Dirección de correo electrónico. */
      email: string;
      /** URL de la foto de perfil. */
      imageUrl?: string;
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
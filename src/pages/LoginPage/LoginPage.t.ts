// #typedef - Datos ingresados por el usuario en el formulario de login
export interface LoginFormDataType {
  email: string;
  password: string;
}
// #end-typedef

// #typedef - Resultado esperado de la autenticación (actualizado)
export interface AuthResponseType {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
// #end-typedef


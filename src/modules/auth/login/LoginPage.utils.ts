// src\modules\auth\login\LoginPage.utils.ts
import { type LoginFormDataType, type AuthResponseType } from "./LoginPage.t";

// #function validateLoginForm - Valida que los campos del formulario de login estén completos
export const validateLoginForm = (data: LoginFormDataType): string[] => {
  const errors: string[] = [];

  if (!data.email.trim()) errors.push("El correo es obligatorio.");
  if (!data.password.trim()) errors.push("La contraseña es obligatoria.");

  return errors;
}
// #end-function
// #function - Realiza una petición POST al backend para autenticar al usuario
export const loginRequest = async (data: LoginFormDataType): Promise<AuthResponseType> => {
  try {
    // #step 1 - Fetch the login endpoint with the provided data
    const response = await fetch("http://localhost:4000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // #end-step
    // #step 2 - Parse the response as JSON and handle errors
    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Error de autenticación",
      };
    }
    // #end-step
    // #step 3 - Store the JWT token in localStorage (if applicable)
    localStorage.setItem('jwt', result.token);
    // #end-step
    // #step 4 - Return the success response with user data
    return {
      success: true,
      message: result.message,
      token: result.token, // si en el futuro se implementa JWT
      user: result.user, // ✅ ahora sí se incluye
    };
    // #end-step
  } catch (error: unknown) {
    // #step 5 - Handle any errors that occur during the fetch
    if (error instanceof Error) {
      console.error("❌ Error en loginRequest:", error.message);
    } else {
      console.error("❌ Error en loginRequest:", error);
    }
    return {
      success: false,
      message: "No se pudo conectar con el servidor.",
    };
  // #end-step
  }
}
// #end-function


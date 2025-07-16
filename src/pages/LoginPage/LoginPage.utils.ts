import { type LoginFormDataType, type AuthResponseType } from "./LoginPage.t";

// #function - Valida que los campos del formulario de login estén completos
export function validateLoginForm(data: LoginFormDataType): string[] {
  const errors: string[] = [];

  if (!data.email.trim()) errors.push("El correo es obligatorio.");
  if (!data.password.trim()) errors.push("La contraseña es obligatoria.");

  return errors;
}
// #end-function

// #function - Realiza una petición POST al backend para autenticar al usuario
export async function loginRequest(data: LoginFormDataType): Promise<AuthResponseType> {
  try {
    const response = await fetch("http://localhost:4000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Error de autenticación",
      };
    }

    return {
      success: true,
      message: result.message,
      token: result.token, // si en el futuro se implementa JWT
      user: result.user, // ✅ ahora sí se incluye
    };

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error en loginRequest:", error.message);
    } else {
      console.error("❌ Error en loginRequest:", error);
    }
    return {
      success: false,
      message: "No se pudo conectar con el servidor.",
    };
  }
}
// #end-function


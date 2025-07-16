import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { useStoreCurrentPage } from "../../store/currentPage/currentPage";
import { type LoginFormDataType } from "./LoginPage.t";
import { validateLoginForm, loginRequest } from "./LoginPage.utils";
import { useAuthStore } from "../../store/authUser/authUser";


// #function - Componente funcional de la página de login
export default function LoginPage() {
  const { changeCurrentPage } = useStoreCurrentPage();
  const [formData, setFormData] = useState<LoginFormDataType>({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  // #event - Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // #end-event

  // #event - Manejador del submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setLoading(true);
    const response = await loginRequest(formData);
    setLoading(false);

    if (response.success) {
      setMessage("¡Bienvenido!");
      console.log("🔍 Respuesta del backend:", response);

      if (response.success && response.user) {
        setUser(response.user); // Guarda los datos del usuario autenticado
        changeCurrentPage("user"); // Redirige a la vista correspondiente
      }
    } else {
      setMessage(response.message);
    }
  };
  // #end-event

  return (
    <div className={styles.container}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        )}

        {message && <p className={styles.message}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
// #end-function

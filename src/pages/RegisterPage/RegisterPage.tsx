// src\pages\RegisterPage\RegisterPage.tsx
import { useState } from "react";
import { registerFormRunner } from "./RegisterPage.utils";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // #event handleRegisterForm - Handles submit event and delegates to runner
  const handleRegisterForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerFormRunner(e.currentTarget, setError, setSuccessMessage);
  };
  // #end-event

  return (
    <div className={styles.container}>
      <h1 className={styles.formTitle}>Registro de Usuario</h1>
      <form onSubmit={handleRegisterForm}>
        {/* #section name */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre completo:</label>
          <input type="text" name="name" id="name" required />
        </div>
        {/* #end-section */}
        {/* #section email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo electrónico:</label>
          <input type="email" name="email" id="email" required />
        </div>
        {/* #end-section */}
        {/* #section password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" name="password" id="password" required />
        </div>
        {/* #end-section */}
        {/* #section confirm password */}
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input type="password" name="confirmPassword" id="confirmPassword" required />
        </div>
        {/* #end-section */}
        {/* #section phone */}
        <div className={styles.formGroup}>
          <label htmlFor="phone">Teléfono (opcional):</label>
          <input type="text" name="phone" id="phone" />
        </div>
        {/* #end-section */}
        {/* #section terms and conditions */}
        <div className={styles.checkboxGroup}>
          <input type="checkbox" name="terms" id="terms" required />
          <label htmlFor="terms">Acepto los términos y condiciones</label>
        </div>
        {/* #end-section */}
        {/* #section submit button */}
        <button type="submit" className={styles.submitButton}>Registrarse</button>
        {/* #end-section */}
        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        {successMessage && <p className={`${styles.message} ${styles.success}`}>{successMessage}</p>}
      </form>
    </div>
  );
};
// #end-function

export default RegisterPage;

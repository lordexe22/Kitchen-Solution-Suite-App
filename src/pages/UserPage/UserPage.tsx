// #section - Página del usuario autenticado
import { useAuthStore } from "../../store/authUser/authUser";
import styles from "./UserPages.module.css";

// #function - Vista del usuario logueado
export default function UserPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <p>No hay información del usuario.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👤 Bienvenido, {user.name}</h2>

      <div className={styles.infoBox}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>

      <div className={styles.actions}>
        <button disabled>Editar perfil</button>
        <button disabled>Ver configuración</button>
        <button disabled>Salir</button>
      </div>
    </div>
  );
}
// #end-function
// #end-section

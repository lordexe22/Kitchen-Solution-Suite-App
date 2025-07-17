import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authUser/authUser";
import styles from "./UserPages.module.css";

type Store = {
  id: number;
  name: string;
  location: string;
};

export default function UserPage() {
  const user = useAuthStore((state) => state.user);
  const [store, setStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/stores?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setStore(data[0]);
          setFormData({ name: data[0].name, location: data[0].location });
        }
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    setError("");

    const body = {
      name: formData.name,
      location: formData.location,
      userId: user.id,
    };

    try {
      const res = await fetch(store ? `/api/stores/${store.id}` : "/api/stores", {
        method: store ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al guardar el local");

      const data = await res.json();
      setStore(data);
    } catch (err: unknown) {
      if(err instanceof Error){
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <p>No hay información del usuario.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👤 Bienvenido, {user.name}</h2>

      <div className={styles.infoBox}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>

      <hr className={styles.divider} />

      <h3 className={styles.subheading}>
        {store ? "Editar Local" : "Registrar Local"}
      </h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre del local"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Ubicación"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {store ? "Guardar cambios" : "Crear local"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

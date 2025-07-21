// src/components/AddBusiness/AddBusiness.tsx
import { useState } from "react";
import styles from "./AddBusiness.module.css";
import { fetchUserBusinesses } from "../BusinessList/BusinessList.utils";
import { type Business } from "../../modules/company/company.t";

type Props = {
  setBusinesses: (b: Business[]) => void;
};

const AddBusiness = ({ setBusinesses }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessAlias, setBusinessAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmedName = businessName.trim();
    if (!trimmedName) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");

      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const userId = payload?.id;
      if (!userId) throw new Error("ID de usuario no encontrado en el token");

      const response = await fetch("http://localhost:4000/api/businesses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          alias: businessAlias.trim() || undefined,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el negocio");
      }

      // → Fetch actualizada
      const updated = await fetchUserBusinesses(token);
      setBusinesses(updated);

      setBusinessName("");
      setBusinessAlias("");
      setShowModal(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error al crear el negocio");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Agregar Negocio</button>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h2>Agregar nuevo negocio</h2>

            <input
              autoFocus
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Nombre del negocio (ej: McDonald's)"
              className={styles.inputField}
              disabled={loading}
            />

            <input
              value={businessAlias}
              onChange={(e) => setBusinessAlias(e.target.value)}
              placeholder="Alias / etiqueta (opcional)"
              className={styles.inputField}
              disabled={loading}
            />

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.buttonsContainer}>
              <button onClick={() => setShowModal(false)} disabled={loading}>
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={loading || !businessName.trim()}>
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBusiness;

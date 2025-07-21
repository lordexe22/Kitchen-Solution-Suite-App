// src/components/BusinessList/BusinessList.tsx
import { useState } from "react";
import styles from "./BusinessList.module.css";

type Business = {
  id: string;
  name: string;
  alias?: string;
  address?: string;
};

type Props = {
  businesses: Business[];
};

const CONFIG_SECTIONS = [
  "Localización",
  "Horarios de apertura",
  "Redes sociales",
  "Medios de contacto",
  "Menú",
];

// Claves alineadas con backend para redes sociales
const SOCIAL_MEDIA_KEYS = [
  { label: "Facebook", key: "facebook_url" },
  { label: "Instagram", key: "instagram_url" },
  { label: "X", key: "x_url" },
  { label: "Tik Tok", key: "tiktok_url" },
  { label: "Threads", key: "threads_url" },
];

const BusinessList = ({ businesses }: Props) => {
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Inicializar socialLinks con claves correctas y valores vacíos
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    tiktok_url: "",
    threads_url: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getDisplayName = (b: Business, index: number) => {
    const { name, alias, address } = b;
    if (alias) return `${name} - ${alias}`;
    if (address) return `${name} - ${address}`;

    const sameNameNoAliasNoAddressBefore = businesses
      .slice(0, index)
      .filter((x) => x.name === name && !x.alias && !x.address).length;

    const label =
      sameNameNoAliasNoAddressBefore === 0 ? name : `${name} (${sameNameNoAliasNoAddressBefore})`;

    return `${label} - [ configure la dirección del local ]`;
  };

  const toggleBusiness = (id: string) => {
    setExpandedBusinessId((prev) => (prev === id ? null : id));
    setExpandedSection(null);
    setSuccess(false);
    setError(null);
  };

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
    setSuccess(false);
    setError(null);
  };

  const handleSocialChange = (platformKey: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platformKey]: value }));
  };

  const handleSocialSubmit = async () => {
    if (!expandedBusinessId) {
      console.warn("No hay ID de negocio expandido.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token JWT no encontrado en localStorage.");
        throw new Error("Token no encontrado");
      }

      console.log("Enviando datos al servidor:", {
        businessId: expandedBusinessId,
        body: socialLinks,
      });

      const response = await fetch(`http://localhost:4000/api/businesses/${expandedBusinessId}/socials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(socialLinks),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Respuesta del servidor con error:", text);
        throw new Error(`Error al guardar redes sociales: ${response.status}`);
      }

      console.log("Respuesta OK del servidor");
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Error en handleSocialSubmit:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al guardar redes sociales");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ul className={styles.list}>
      {businesses.map((b, i) => (
        <li key={b.id} className={styles.item}>
          <button className={styles.header} onClick={() => toggleBusiness(b.id)}>
            {getDisplayName(b, i)}
          </button>

          {expandedBusinessId === b.id && (
            <div className={styles.configPanel}>
              <ul>
                {CONFIG_SECTIONS.map((section) => (
                  <li key={section} className={styles.configItem}>
                    <button
                      className={styles.sectionHeader}
                      onClick={() => toggleSection(section)}
                    >
                      {section}
                    </button>

                    {expandedSection === section && section === "Redes sociales" && (
                      <form
                        className={styles.socialForm}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSocialSubmit();
                        }}
                      >
                        {SOCIAL_MEDIA_KEYS.map(({ label, key }) => (
                          <div key={key} className={styles.inputGroup}>
                            <label>{label}</label>
                            <input
                              type="url"
                              placeholder={`https://${label.toLowerCase()}.com/...`}
                              value={socialLinks[key] || ""}
                              onChange={(e) => handleSocialChange(key, e.target.value)}
                            />
                          </div>
                        ))}
                        <button type="submit" disabled={saving} className={styles.saveButton}>
                          {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                        {success && <p className={styles.successMsg}>Guardado correctamente.</p>}
                        {error && <p className={styles.errorMsg}>{error}</p>}
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BusinessList;

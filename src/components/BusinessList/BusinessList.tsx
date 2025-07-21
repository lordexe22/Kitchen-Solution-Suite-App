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

const SOCIAL_MEDIA = [
  { label: "Facebook", key: "facebook_url" },
  { label: "Instagram", key: "instagram_url" },
  { label: "X", key: "x_url" },
  { label: "Tik Tok", key: "tiktok_url" },
  { label: "Threads", key: "threads_url" },
];

const BusinessList = ({ businesses }: Props) => {
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook_url: "",
    instagram_url: "",
    x_url: "",
    tiktok_url: "",
    threads_url: "",
  });
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
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

  const toggleBusiness = async (id: string) => {
    const isSame = expandedBusinessId === id;
    setExpandedBusinessId(isSame ? null : id);
    setExpandedSection(null);
    setSuccess(false);
    setError(null);

    if (isSame) return;

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`http://localhost:4000/api/businesses/${id}/socials`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error al obtener redes sociales:", await response.text());
        return;
      }

      const data = await response.json();

      console.log({data});

      setSocialLinks(data.socials || {});
      setLastUpdate(data.lastUpdate || null);
    } catch (err) {
      console.error("Error al hacer fetch de redes sociales:", err);
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
    setSuccess(false);
    setError(null);
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const handleSocialSubmit = async () => {
    if (!expandedBusinessId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token no encontrado");

      console.log({socialLinks});

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
        throw new Error(`Error al guardar redes sociales: ${text}`);
      }

      setSuccess(true);
    } catch (err: unknown) {
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
                        {SOCIAL_MEDIA.map(({ label, key }) => (
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
                        {lastUpdate && (
                          <p className={styles.lastUpdateMsg}>
                            Última actualización: {new Date(lastUpdate).toLocaleString()}
                          </p>
                        )}
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

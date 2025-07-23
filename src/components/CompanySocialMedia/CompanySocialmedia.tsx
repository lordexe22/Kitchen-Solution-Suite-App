// src/components/CompanySocialMedia/CompanySocialMedia.tsx

import { SOCIAL_MEDIA } from "../../modules/companySocialMedia/companySocialMedia.config";
import styles from "../CompanyArray/CompanyArray.module.css";

type Props = {
  socialLinks: Record<string, string>;
  saving: boolean;
  success: boolean;
  error: string | null;
  lastUpdate: string | null;
  onChange: (platform: string, value: string) => void;
  onSubmit: () => void;
};

const CompanySocialMedia = ({
  socialLinks,
  saving,
  success,
  error,
  lastUpdate,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <form
      className={styles.socialForm}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {SOCIAL_MEDIA.map(({ label, key }) => (
        <div key={key} className={styles.inputGroup}>
          <label>{label}</label>
          <input
            type="url"
            placeholder={`https://${label.toLowerCase()}.com/...`}
            value={socialLinks[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
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
  );
};

export default CompanySocialMedia;

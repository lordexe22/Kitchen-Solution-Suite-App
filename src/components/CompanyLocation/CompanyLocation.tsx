import styles from "./CompanyLocation.module.css";
import { type LocationData } from "../../modules/companyLocation/companyLocation.t";

type Props = {
  location: LocationData;
  saving: boolean;
  success: boolean;
  error: string | null;
  lastUpdate: string | null;
  onChange: (field: keyof LocationData, value: string) => void;
  onSubmit: () => void;
};

const CompanyLocation = ({
  location,
  saving,
  success,
  error,
  lastUpdate,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <label>
        Dirección
        <input
          type="text"
          value={location.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </label>

      <label>
        Ciudad
        <input
          type="text"
          value={location.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
      </label>

      <label>
        Provincia
        <input
          type="text"
          value={location.province}
          onChange={(e) => onChange("province", e.target.value)}
        />
      </label>

      <button onClick={onSubmit} disabled={saving}>
        {saving ? "Guardando..." : "Guardar ubicación"}
      </button>

      {success && <p className={styles.success}>Ubicación guardada correctamente.</p>}
      {error && <p className={styles.error}>{error}</p>}
      {lastUpdate && <p className={styles.meta}>Última actualización: {lastUpdate}</p>}
    </div>
  );
};

export default CompanyLocation;

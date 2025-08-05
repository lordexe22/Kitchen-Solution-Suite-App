// src/components/CompanyLocation/CompanyLocation.tsx

import { useEffect } from "react";
import styles from "./CompanyLocation.module.css";
import { useCompanyLocationController } from "../../modules/companyLocation/companyLocation.hooks";

type Props = {
  companyId: string;
};

const CompanyLocation = ({ companyId }: Props) => {
  const {
    location,
    locationSaving,
    locationSuccess,
    locationError,
    locationLastUpdate,
    fetchLocation,
    saveLocation,
    handleLocationChange,
  } = useCompanyLocationController();

  useEffect(() => {
    if (companyId) {
      fetchLocation(companyId);
    }
  }, [companyId, fetchLocation]);

  const handleSubmit = () => {
    if (companyId) {
      saveLocation(companyId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <label>
        Dirección
        <input
          type="text"
          value={location.address}
          onChange={(e) => handleLocationChange("address", e.target.value)}
        />
      </label>

      <label>
        Ciudad
        <input
          type="text"
          value={location.city}
          onChange={(e) => handleLocationChange("city", e.target.value)}
        />
      </label>

      <label>
        Provincia
        <input
          type="text"
          value={location.province}
          onChange={(e) => handleLocationChange("province", e.target.value)}
        />
      </label>

      <button onClick={handleSubmit} disabled={locationSaving}>
        {locationSaving ? "Guardando..." : "Guardar ubicación"}
      </button>

      {locationSuccess && <p className={styles.success}>Ubicación guardada correctamente.</p>}
      {locationError && <p className={styles.error}>{locationError}</p>}
      {locationLastUpdate && (
        <p className={styles.meta}>
          Última actualización: {new Date(locationLastUpdate).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default CompanyLocation;

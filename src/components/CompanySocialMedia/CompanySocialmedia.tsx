// src/components/CompanySocialMedia/CompanySocialMedia.tsx
// #section Imports
import { useEffect } from "react";
import { SOCIAL_MEDIA } from "../../modules/companySocialMedia/companySocialMedia.config";
import { useCompanySocialMediaController } from "../../modules/companySocialMedia/companySocialMedia.hooks";
import styles from "../CompanyArray/CompanyArray.module.css";
// #end-section
// #type Props
type Props = {
  companyId: string;
};
// #end-type
// #component CompanySocialMedia
const CompanySocialMedia = ({ companyId }: Props) => {
  // #hook useCompanySocialMediaController() - socialMediaLinks, socialMediaLastUpdate, socialMediaSaving, socialMediaError, socialMediaSuccess, fetchSocialMediaLinks, saveSocialMediaLinks, handleSocialMediaChange
  const {
    socialMediaLinks,
    socialMediaLastUpdate,
    socialMediaSaving,
    socialMediaError,
    socialMediaSuccess,
    fetchSocialMediaLinks,
    saveSocialMediaLinks,
    handleSocialMediaChange,
  } = useCompanySocialMediaController();
  // #end-hook
  // #event useeffect [companyId, fetchSocialMediaLinks]
  useEffect(() => {
    if (companyId) {
      fetchSocialMediaLinks(companyId);
    }
  }, [companyId, fetchSocialMediaLinks]);
  // #end-event
  // #event handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyId) {
      saveSocialMediaLinks(companyId);
    }
  };
  // #end-event
  // #section return
  return (
    <form className={styles.socialForm} onSubmit={handleSubmit}>
      {SOCIAL_MEDIA.map(({ label, key }) => (
        <div key={key} className={styles.inputGroup}>
          <label>{label}</label>
          <input
            type="url"
            placeholder={`https://${label.toLowerCase()}.com/...`}
            value={socialMediaLinks[key] || ""}
            onChange={(e) => handleSocialMediaChange(key, e.target.value)}
          />
        </div>
      ))}
      <button type="submit" disabled={socialMediaSaving} className={styles.saveButton}>
        {socialMediaSaving ? "Guardando..." : "Guardar cambios"}
      </button>
      {socialMediaSuccess && <p className={styles.successMsg}>Guardado correctamente.</p>}
      {socialMediaError && <p className={styles.errorMsg}>{socialMediaError}</p>}
      {socialMediaLastUpdate && (
        <p className={styles.lastUpdateMsg}>
          Última actualización: {new Date(socialMediaLastUpdate).toLocaleString()}
        </p>
      )}
    </form>
  );
  // #end-section
};
export default CompanySocialMedia;
// #end-component
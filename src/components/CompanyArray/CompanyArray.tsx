// src/components/CompanyArray/CompanyArray.tsx

import { CONFIG_SECTIONS } from "../../modules/company/company.config";
import { type CompanyBaseDataType } from "../../modules/company/company.t";
import { useCompanyAccordion,} from "../../modules/company/company.hooks";
import { useCompanySocialMediaController } from "../../modules/companySocialMedia/companySocialMedia.hooks";
import CompanySocialMedia from "../CompanySocialMedia/CompanySocialmedia";
import styles from "./CompanyArray.module.css";

type Props = {
  companies: CompanyBaseDataType[];
};

const CompanyArray = ({ companies: businesses }: Props) => {
  /* #function useCompanyAccordion - Hook para manejar el acordeón de empresas */
  // #variable expandedCompanyId, expandedSection, toggleCompany, toggleSection
  const {
    expandedCompanyId,
    expandedSection,
    toggleCompany,
    toggleSection,
  } = useCompanyAccordion();
  // #end-variable
  /* #function useCompanySocialMediaController - Hook para manejar redes sociales de una empresa */
  // #variable socialLinks, lastUpdate, saving, error, success, fetchSocialLinks, saveSocialLinks, handleChange, setError, setSuccess
  const {
    socialLinks,
    lastUpdate,
    saving,
    error,
    success,
    fetchSocialLinks,
    saveSocialLinks,
    handleChange,
    setError,
    setSuccess,
  } = useCompanySocialMediaController();
  // #end-variable

  const getDisplayName = (b: CompanyBaseDataType, index: number) => {
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
    const isSame = expandedCompanyId === id;
    toggleCompany(id);
    setSuccess(false);
    setError(null);

    if (isSame) return;

    await fetchSocialLinks(id);
  };

  const handleSocialSubmit = async () => {
    if (!expandedCompanyId) return;
    await saveSocialLinks(expandedCompanyId);
  };

  return (
    <ul className={styles.list}>
      {businesses.map((b, i) => (
        <li key={b.id} className={styles.item}>
          <button className={styles.header} onClick={() => toggleBusiness(b.id)}>
            {getDisplayName(b, i)}
          </button>

          {expandedCompanyId === b.id && (
            <div className={styles.configPanel}>
              <ul>
                {CONFIG_SECTIONS.map((section) => (
                  <li key={section} className={styles.configItem}>
                    <button
                      className={styles.sectionHeader}
                      onClick={() => {
                        toggleSection(section);
                        setSuccess(false);
                        setError(null);
                      }}
                    >
                      {section}
                    </button>

                    {expandedSection === section && section === "Redes sociales" && (
                      <CompanySocialMedia
                        socialLinks={socialLinks}
                        saving={saving}
                        success={success}
                        error={error}
                        lastUpdate={lastUpdate}
                        onChange={handleChange}
                        onSubmit={handleSocialSubmit}
                      />
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

export default CompanyArray;


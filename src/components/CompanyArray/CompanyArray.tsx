/* src/components/CompanyArray/CompanyArray.tsx */
// #section Imports
import type { CompanyBaseDataType } from "../../modules/company/company.t";
import type { CompanyArrayProps } from "../../modules/companyArray/companyArray.t";
import { CONFIG_SECTIONS } from "../../modules/companyArray/companyArray.config";
import { useCompanyAccordion,} from "../../modules/company/company.hooks";
import { useCompanySocialMediaController } from "../../modules/companySocialMedia/companySocialMedia.hooks";
import { useCompanyLocationController } from "../../modules/companyLocation/companyLocation.hooks";
import CompanySocialMedia from "../CompanySocialMedia/CompanySocialmedia";
import CompanyLocation from "../CompanyLocation/CompanyLocation";
import CompanySchedule from "../CompanySchedule/CompanySchedule";
import styles from "./CompanyArray.module.css";
// #end-section

// #function CompanyArray - This component renders a list of companies with expandable sections for configuration
const CompanyArray = ({ companies }: CompanyArrayProps) => {
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
  // #variable socialMediaLinks, socialMediaLastUpdate, socialMediaSaving, socialMediaError, socialMediaSuccess, fetchSocialMediaLinks, saveSocialMediaLinks, handleSocialMediaChange, setSocialMediaError, setSocialMediaSuccess
  const {
    socialMediaLinks,
    socialMediaLastUpdate,
    socialMediaSaving,
    socialMediaError,
    socialMediaSuccess,
    fetchSocialMediaLinks,
    saveSocialMediaLinks,
    handleSocialMediaChange,
    setSocialMediaSuccess,
    setSocialMediaError,
  } = useCompanySocialMediaController();
  // #end-variable
  /* #function useCompanyLocationController - Hook para manejar la ubicación de una empresa */
  // #variable location, locationLastUpdate, locationSaving, locationError, locationSuccess, fetchLocation, saveLocation, handleLocationChange, setLocationSuccess, setLocationError
  const {
    location,
    locationSaving,
    locationSuccess,
    locationError,
    locationLastUpdate,
    fetchLocation,
    saveLocation,
    handleLocationChange,
    setLocationSuccess,
    setLocationError,
  } = useCompanyLocationController();
  // #end-variable
  // #function getDisplayName - Generates a display name for a company based on its properties
  const getDisplayName = (b: CompanyBaseDataType, index: number) => {
    const { name, alias, address } = b;
    if (alias) return `${name} - ${alias}`;
    if (address) return `${name} - ${address}`;

    const sameNameNoAliasNoAddressBefore = companies
      .slice(0, index)
      .filter((x) => x.name === name && !x.alias && !x.address).length;

    const label =
      sameNameNoAliasNoAddressBefore === 0 ? name : `${name} (${sameNameNoAliasNoAddressBefore})`;

    return `${label} - [ configure la dirección del local ]`;
  };
  // #end-function
  // #event handleToggleCompany - Toggles the expansion of a business section and fetches social links if necessary
  const handleToggleCompany = async (id: string) => {
    const isSame = expandedCompanyId === id;

    toggleCompany(id);

    setSocialMediaSuccess(false);
    setSocialMediaError(null);
    setLocationSuccess(false);
    setLocationError(null);

    if (isSame) return;

    await Promise.all([
      fetchSocialMediaLinks(id),
      fetchLocation(id),
    ]);
    console.log("[handleToggleCompany] fetchLocation y fetchSocialMediaLinks completados");
  };
  // #end-event
  // #event handleSocialMediaSubmit - Handles the submission of social media links for the expanded company
  const handleSocialMediaSubmit = async () => {
    if (!expandedCompanyId) return;
    await saveSocialMediaLinks(expandedCompanyId);
  };
  // #end-event
  // #event handleLocationSubmit - Handles the submission of location data for the expanded company
  const handleLocationSubmit = async () => {
    if (!expandedCompanyId) return;
    await saveLocation(expandedCompanyId);
  };
  // #end-event

  // #section return
  return (
    <ul className={styles.list}>
      {companies.map((b, i) => (
        <li key={b.id} className={styles.item}>

          <button className={styles.header} onClick={() => handleToggleCompany(b.id)}>
            {getDisplayName(b, i)}
          </button>

          {expandedCompanyId === b.id && (
            <div className={styles.configPanel}>
              <ul>
                {/* #section - for every company section, show one button for expand and see more options */}
                {CONFIG_SECTIONS.map((section) => (
                  <li key={section.id} className={styles.configItem}>
                    {/* #section - button with the name of the section, allow collapse for see the company options */}
                    <button
                      className={styles.sectionHeader}
                      onClick={() => {
                        toggleSection(section.id);
                        setSocialMediaSuccess(false);
                        setSocialMediaError(null);
                      }}
                    >
                      {section.label}
                    </button>
                    {/* #end-section */}
                    {/* #section - (if expanded) show inputs for social media */}
                    {expandedSection === section.id && section.id === "socialMedia" && (
                      <CompanySocialMedia
                        socialLinks={socialMediaLinks}
                        saving={socialMediaSaving}
                        success={socialMediaSuccess}
                        error={socialMediaError}
                        lastUpdate={socialMediaLastUpdate}
                        onChange={handleSocialMediaChange}
                        onSubmit={handleSocialMediaSubmit}
                      />
                    )}
                    {/* #end-section */}
                    {/* #section - (if expanded) show inputs for location */}
                    {expandedSection === section.id && section.id === "location" && (
                      <CompanyLocation
                        location={location}
                        saving={locationSaving}
                        success={locationSuccess}
                        error={locationError}
                        lastUpdate={locationLastUpdate}
                        onChange={handleLocationChange}
                        onSubmit={handleLocationSubmit}
                      />
                    )}
                    {/* #end-section */}
                    {/* #section - (if expanded) show inputs for social media */}
                    {expandedSection === section.id && section.id === "schedule" && (
                      <CompanySchedule companyId={expandedCompanyId}/>
                    )}
                    {/* #end-section */}
                  </li>
                ))}
                {/* #end-section */}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
  // #end-section
};
export default CompanyArray;
// #end-function


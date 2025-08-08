/* src/components/CompanyArray/CompanyArray.tsx */
// #section Imports
import type { CompanyBaseDataType } from "../../modules/company/company.t";
import type { CompanyArrayProps } from "../../modules/companyArray/companyArray.t";
import { CONFIG_SECTIONS } from "../../modules/companyArray/companyArray.config";
import { useCompanyAccordion,} from "../../modules/company/company.hooks";
import CompanySocialMedia from "../CompanySocialMedia/CompanySocialMedia";
import CompanyLocation from "../CompanyLocation/CompanyLocation";
import CompanySchedule from "../CompanySchedule/CompanySchedule";
import CompanyGeneralConfig from "../CompanyGeneralConfig/CompanyGeneralConfig";
import styles from "./CompanyArray.module.css";
// #end-section

// #function CompanyArray - This component renders a list of companies with expandable sections for configuration
const CompanyArray = ({ companies }: CompanyArrayProps) => {
  // #hook useCompanyAccordion - expandedCompanyId, expandedSection, toggleCompany, toggleSection
  const {
    expandedCompanyId,
    expandedSection,
    toggleCompany,
    toggleSection,
  } = useCompanyAccordion();
  // #end-hook
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
  const handleToggleCompany = (id: string) => {
    const isSame = expandedCompanyId === id;
    toggleCompany(id);
    if (isSame) return;
  };
  // #end-event
  // #section return
  return (
    <ul className={styles.list}>
      {companies.map((b, i) => (
        <li key={b.id} className={styles.item}>
          {/* #section - button that show the company name */}
          <button className={styles.header} onClick={() => handleToggleCompany(b.id)}>
            {getDisplayName(b, i)}
          </button>
          {/* #end-section */}
          {expandedCompanyId === b.id && (
            <div className={styles.configPanel}>
              <ul>
                {/* #section - for every company section, show one button for expand and see more options */}
                {CONFIG_SECTIONS.map((section) => (
                  <li key={section.id} className={styles.configItem}>
                    {/* #section - button that show the section name, allow collapse for see the company options */}
                    <button
                      className={styles.sectionHeader}
                      onClick={() => {
                        toggleSection(section.id);
                      }}
                    >
                      {section.label}
                    </button>
                    {/* #end-section */}
                    {/* #section - CompanyGeneralConfig >> (if expanded) show general config of the company */}
                    {expandedSection === section.id && section.id === "basicConfig" && expandedCompanyId && (
                      <CompanyGeneralConfig companyId={expandedCompanyId} />
                    )}
                    {/* #end-section */}
                    {/* #section - CompanySocialMedia >> (if expanded) show inputs for social media */}
                    {expandedSection === section.id && section.id === "socialMedia" && expandedCompanyId && (
                      <CompanySocialMedia companyId={expandedCompanyId} />
                    )}
                    {/* #end-section */}
                    {/* #section - CompanyLocation (if expanded) show inputs for location */}
                    {expandedSection === section.id && section.id === "location" && expandedCompanyId && (
                      <CompanyLocation companyId={expandedCompanyId} />
                    )}
                    {/* #end-section */}
                    {/* #section - CompanySchedule (if expanded) show inputs for config schedule */}
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


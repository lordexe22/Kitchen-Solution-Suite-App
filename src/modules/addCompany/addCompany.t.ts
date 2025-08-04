// #section imports
import type { CompanyBaseDataType } from "../company/company.t";
// #end-section
// #type AddCompanyProps
export interface AddCompanyProps {
  setCompanies: (b: CompanyBaseDataType[]) => void;
};
// #end-type
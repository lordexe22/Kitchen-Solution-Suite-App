// #section imports
import type { Company } from '../../store/Companies.types';
// #end-section
// #interface CompanyListProps
export interface CompanyListProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: number) => void;
}
// #end-interface
/* src/components/CompanyList/CompanyList.tsx */
// #section imports
import CompanyAccordion from '../CompanyAccordion/CompanyAccordion';
import type { Company } from '../../store/Companies.types';
import type { ReactNode } from 'react';
import styles from './CompanyList.module.css';
// #end-section

// #interface CompanyListProps
interface CompanyListProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: number) => void;
  renderChildren?: (company: Company) => ReactNode; // NUEVO: función opcional
}
// #end-interface

// #component CompanyList
/**
 * Componente que lista todas las compañías del usuario.
 * Renderiza un CompanyAccordion por cada compañía.
 * El contenido de cada accordion es configurable via renderChildren.
 */
const CompanyList = ({ 
  companies, 
  onEditCompany,
  onDeleteCompany,
  renderChildren
}: CompanyListProps) => {
  return (
    <div className={styles.list}>
      {companies.map((company) => (
        <CompanyAccordion
          key={company.id}
          company={company}
          onEdit={() => onEditCompany(company)}
          onDelete={() => onDeleteCompany(company.id)}
        >
          {renderChildren && renderChildren(company)}
        </CompanyAccordion>
      ))}
    </div>
  );
};

export default CompanyList;
// #end-component
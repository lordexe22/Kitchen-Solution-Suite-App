/* src/pages/ClientPage/ClientPage.tsx */
// #section Importaciones
import AddCompany from "../../components/AddCompany/AddCompany";
import CompanyArray from "../../components/CompanyArray/CompanyArray";
import { useLoadUserCompanies } from "../../modules/company/company.hooks";
import { useState } from "react";
import { type CompanyBaseDataType } from "../../modules/company/company.t";
// #end-section
// #component ClientPage - Client page
/**
 * Client page.
 * Shows a list of the associated companies for the authenticated user and a form for add new companies.
 */
const ClientPage = () => {
  // #state [companies, setCompanies] - Array for the authenticated user's companies
  const [companies, setCompanies] = useState<CompanyBaseDataType[]>([]);
  // #end-state
  // #hook useLoadUserCompanies(setCompanies) - Loads the companies associated with the authenticated user.
  useLoadUserCompanies(setCompanies);
  // #end-hook
  // #section return
  return (
    <>
      <h1>Cliente</h1>
      <CompanyArray companies={companies} />
      <AddCompany setCompanies={setCompanies} />    </>
  );
  // #end-section
};

export default ClientPage;
// #end-component

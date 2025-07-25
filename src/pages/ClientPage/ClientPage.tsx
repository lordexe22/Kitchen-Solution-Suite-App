/* src/pages/ClientPage/ClientPage.tsx */

// #section Importaciones
import AddCompany from "../../components/AddCompany/AddCompany";
import CompanyArray from "../../components/CompanyArray/CompanyArray";
import { useLoadUserCompanies } from "../../modules/company/company.hooks";
import { useState } from "react";
import { type CompanyBaseDataType } from "../../modules/company/company.t";
// #end-section

// #function ClientPage - Página principal del cliente
/**
 * Página principal del cliente.
 * Muestra el listado de negocios asociados y un formulario para agregar nuevos.
 */
const ClientPage = () => {
  // #variable businesses - Estado de negocios del usuario obtenido desde el hook
  const [businesses, setBusinesses] = useState<CompanyBaseDataType[]>([]);
  useLoadUserCompanies(setBusinesses);
  // #end-variable
  // #section return
  return (
    <>
      <h1>Cliente</h1>
      <CompanyArray companies={businesses} />
      <AddCompany setBusinesses={setBusinesses} />    </>
  );
  // #end-section
};

export default ClientPage;
// #end-function

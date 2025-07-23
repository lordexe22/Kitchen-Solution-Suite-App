/* src/pages/ClientPage/ClientPage.tsx */

// #section Importaciones
import AddBusiness from "../../components/AddCompany/AddCompany";
import CompanyArray from "../../components/CompanyArray/CompanyArray";
import { useLoadUserCompanies } from "../../modules/company/company.hooks";
// #end-section

// #function ClientPage - Página principal del cliente
/**
 * Página principal del cliente.
 * Muestra el listado de negocios asociados y un formulario para agregar nuevos.
 */
const ClientPage = () => {
  // #variable businesses - Estado de negocios del usuario obtenido desde el hook
  const { businesses } = useLoadUserCompanies();
  // #end-variable
  // #section return
  return (
    <>
      <h1>Cliente</h1>
      <AddBusiness setBusinesses={() => {}} />
      <CompanyArray companies={businesses} />
    </>
  );
  // #end-section
};

export default ClientPage;
// #end-function

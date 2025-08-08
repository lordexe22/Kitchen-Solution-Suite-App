/* src\components\CompanyGeneralConfig\CompanyGeneralConfig.tsx */
// #section Imports
import type { companyGeneralConfigPropsType } from "../../modules/companyGeneralConfig/companyGeneralConfig.t"
// #end-section

// #component CompanyGeneralConfig
const CompanyGeneralConfig = ({companyId}:companyGeneralConfigPropsType) => {
  return(
    <>
      <h1>Company ID</h1>
      <p>{companyId}</p>
    </>
  )
}
export default CompanyGeneralConfig
// #end-component
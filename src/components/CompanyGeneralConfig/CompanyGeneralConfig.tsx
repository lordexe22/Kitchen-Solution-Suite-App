/* src\components\CompanyGeneralConfig\CompanyGeneralConfig.tsx */
// #section Imports
import type { CompanyBasicDataType, companyGeneralConfigPropsType } from "../../modules/companyGeneralConfig/companyGeneralConfig.t"
import { fetchWithJWT } from "../../utils/fetch";
import { uploadImageAndGetURL } from "../../modules/addCompany/addCompany.utils";
import { decodeJWTPayload } from "../../utils/jwt";
import { API_FETCH_ACTIONS } from "../../modules/company/company.config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
// #end-section



// #component CompanyGeneralConfig
const CompanyGeneralConfig = ({companyId}:companyGeneralConfigPropsType) => {
  const [companyName, setCompanyName] = useState<string | null>('');
  const [companyAlias, setCompanyAlias] = useState<string | null>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [localLogoPreview, setLocalLogoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  // #event - Get company data when render the component
  useEffect(()=>{
    const fetchCompanyData = async () => {
      const data = await fetchWithJWT<CompanyBasicDataType>(`http://localhost:4000/api/companies/${companyId}/basic`);
      setCompanyName(data.name || null)
      setCompanyAlias(data.alias || null)
    }
    fetchCompanyData();
  },[companyId])
  // #end-event

  // #event handleCompanyNameInputChange
  const handleCompanyNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInputContent = e.target.value;
    setCompanyName(currentInputContent)
  }
  // #end-event

  // #event handleCompanyAliasInputChange
  const handleCompanyAliasInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInputContent = e.target.value;
    setCompanyAlias(currentInputContent)
  }
  // #end-event

  // #event handleCompanyLogoInputChange
  const handleCompanyLogoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setLogoFile(file as File)

    const previewUrl = URL.createObjectURL(file);
    setLocalLogoPreview(previewUrl);
  };
  // #end-event

  // #event handleConfirmChanges
  const handleConfirmChanges = async () => {
    // #step 1 - Validate companies name and alias >> trimmedName, trimmedAlias
    const trimmedName = companyName?.trim() || undefined;
    const trimmedAlias = companyAlias?.trim() || undefined;
    // #end-step    
    try {
      // #step 2 - Get the JWT token from localStorage and decode it to get the user ID from the payload
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Token not found");
      const payload = decodeJWTPayload(token);
      const userId = payload?.id;
      if (!userId) throw new Error("User ID not found in token");
      // #end-step
      // #step 3 - Try to create the url for the image logo
      let logoUrl: string | undefined;
      if (logoFile) {
        try {
          logoUrl = await uploadImageAndGetURL(logoFile);
        } catch (uploadError: unknown) {
          throw new Error(`Error al subir el logo. Inténtalo nuevamente. Error: ${uploadError}`);
        }
      }
      // #end-step
      // #step 4 - Make the request to create the company
      // url with companyID dynamic variable changed
      const url = API_FETCH_ACTIONS.editCompanyBaseData.url.replace('${companyID}',companyId as string)
      await fetchWithJWT(
        url,
        API_FETCH_ACTIONS.editCompanyBaseData.method,
        {
          name: trimmedName,
          alias: trimmedAlias,
          logo_url: logoUrl,
        }
      );
      // #end-step
      // Forzar recarga de la ruta /client para que se actualice el contenido
      navigate('/client', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error(error)
    }
  }

  // #end-event

  return(
    <>
      <input 
        type="file" 
        accept="image/*" 
        name="input_company_logo" 
        id="input_company_logo"
        onChange={handleCompanyLogoInputChange} 
      />
      {localLogoPreview && (
        <img
          src={localLogoPreview}
          alt="Vista previa del logo seleccionado"
          style={{ maxWidth: "200px", display: "block", marginBottom: "1rem" }}
        />
      )}
      <input 
        type="text" 
        placeholder="company name"
        value={companyName || ''}
        name="input_company_name" 
        id="input_company_name" 
        onChange={handleCompanyNameInputChange}
      />
      <input 
        type="text" 
        placeholder="company alias"
        value={companyAlias || ''}
        name="input_company_alias" 
        id="input_company_alias" 
        onChange={handleCompanyAliasInputChange}
      />
      <button onClick={handleConfirmChanges} title="Confirmar cambios" name="confirmar_cambios">
        Confirmar cambios
      </button>
    </>
  )
}
export default CompanyGeneralConfig
// #end-component
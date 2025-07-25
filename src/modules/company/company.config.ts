/* src\components\BusinessList\CompanyArray.config.ts */
// #variable CONFIG_SECTIONS - Secciones de configuración del negocio
export const CONFIG_SECTIONS = [
  "Localización",
  "Horarios de apertura",
  "Redes sociales",
  "Medios de contacto",
  "Menú",
];
// #end-variable
// #variable API_URL_LIST - URLs de la API relacionadas con los negocios
export const API_URL_LIST = {
  getMyCompanies: "http://localhost:4000/api/companies/mine"
}
// #end-variable
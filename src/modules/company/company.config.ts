/* src\modules\company\company.config.ts */
// #section Imports
import type { FetchActionType } from "./company.t"
// #end-section
// #variable API_FETCH_ACTIONS - URLs de la API relacionadas con los negocios
export const API_FETCH_ACTIONS = {
  // #section - createCompany
  createCompany:{
    method: 'POST',
    url: 'http://localhost:4000/api/companies/create'
  },
  // #end-section
  // #section - getMyCompanies
  getMyCompanies: {
    method: 'GET',
    url: 'http://localhost:4000/api/companies/mine'
  },
  // #end-section
  // #section - getUserByJWT
  getUserByJWT: {
    method: 'GET',
    url: 'http://localhost:4000/api/auth/me'
  }
  // #end-section
} as Record<string, FetchActionType>
// #info >> as Record <K,V> es de typescript y le dice que trate al objeto de forma tal que sus campos tengan una llave <K> de tipo string y un valor <V> de tipo FetchActionType
// #end-variable
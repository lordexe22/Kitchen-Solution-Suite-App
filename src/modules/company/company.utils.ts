// src\components\BusinessList\BusinessList.utils.ts

import { API_FETCH_ACTIONS } from "./company.config";

// #function fetchUserCompanyArray
export const fetchUserCompanyArray = async (token: string) => {
  const response = await fetch(API_FETCH_ACTIONS.getMyCompanies.url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener negocios");
  }

  const data = await response.json();
  return data.companies;
};
// #end-function

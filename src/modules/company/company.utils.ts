// src\components\BusinessList\BusinessList.utils.ts

import { API_URL_LIST } from "./company.config";

// #function fetchUserCompanyArray
export const fetchUserCompanyArray = async (token: string) => {
  const response = await fetch(API_URL_LIST.getMyCompanies, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al obtener negocios");
  }

  const data = await response.json();
  return data.businesses;
};
// #end-function

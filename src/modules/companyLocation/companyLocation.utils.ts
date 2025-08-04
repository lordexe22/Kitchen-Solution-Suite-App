// src\modules\companyLocation\companyLocation.utils.ts
import { type LocationData, type GetCompanyLocationResponse } from "./companyLocation.t";
import { fetchWithJWT } from "../../utils/fetch";

const BASE_URL = "http://localhost:4000/api/companies";

export const getCompanyLocation = async (
  companyId: string
): Promise<GetCompanyLocationResponse> => {
  return await fetchWithJWT<GetCompanyLocationResponse>(`${BASE_URL}/${companyId}/location`);
};

export const updateCompanyLocation = async (
  companyId: string,
  location: LocationData
): Promise<void> => {
  await fetchWithJWT<void>(`${BASE_URL}/${companyId}/location`, "PUT", location);
};

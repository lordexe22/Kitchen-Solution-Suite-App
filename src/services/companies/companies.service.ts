// src/services/companies/companies.service.ts
// #section Imports
import type { Company, CompanyFormData } from '../../types/companies.types';
import { httpClient } from '../../api/httpClient.instance';
// #end-section

// #types
export interface GetAllCompaniesParams {
  state?: 'active' | 'archived';
  page?: number;
  limit?: number;
}

export interface GetAllCompaniesResponse {
  success: boolean;
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCompanyResponse {
  success: boolean;
  company: Company;
}

export interface UpdateCompanyResponse {
  success: boolean;
  company: Company;
}

export interface DeleteCompanyResponse {
  success: boolean;
}

export interface CheckNameResponse {
  success: boolean;
  available: boolean;
}
// #end-types

// #function getAllCompanies
/**
 * Obtiene todas las compañías del usuario autenticado.
 * Soporta filtrado por estado y paginación.
 *
 * @async
 * @param {GetAllCompaniesParams} params - Parámetros de filtrado y paginación.
 * @returns {Promise<GetAllCompaniesResponse>} Lista de compañías con metadata de paginación.
 * @throws {Error} Si el token JWT no es válido o la solicitud falla.
 */
export const getAllCompanies = async (
  params: GetAllCompaniesParams = {}
): Promise<GetAllCompaniesResponse> => {
  const queryParams = new URLSearchParams();
  if (params.state) queryParams.append('state', params.state);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const url = `/dashboard/company${queryString ? `?${queryString}` : ''}`;
  
  const response = await httpClient.get<{ data: GetAllCompaniesResponse }>(url);
  return response.data;
};
// #end-function

// #function createCompany
/**
 * Crea una nueva compañía para el usuario autenticado.
 * El backend valida el JWT y asocia la compañía con el userId del token.
 *
 * @async
 * @param {CompanyFormData} companyData - Datos de la compañía a crear.
 * @returns {Promise<CreateCompanyResponse>} Datos de la compañía creada.
 * @throws {Error} Si el nombre ya existe o la validación falla.
 */
export const createCompany = async (companyData: CompanyFormData): Promise<CreateCompanyResponse> => {
  const response = await httpClient.post<{ data: Company }>('/dashboard/company', companyData);
  return { success: true, company: response.data };
};
// #end-function

// #function updateCompany
/**
 * Actualiza una compañía existente del usuario autenticado.
 * Solo el propietario puede actualizar la compañía.
 *
 * @async
 * @param {number} companyId - ID de la compañía a actualizar.
 * @param {Partial<CompanyFormData>} companyData - Datos a actualizar.
 * @returns {Promise<UpdateCompanyResponse>} Datos de la compañía actualizada.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const updateCompany = async (
  companyId: number,
  companyData: Partial<CompanyFormData>
): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.patch<{ data: Company }>(`/dashboard/company/${companyId}`, companyData);
  return { success: true, company: response.data };
};
// #end-function

// #function deleteCompany
/**
 * Elimina permanentemente una compañía del usuario autenticado.
 * Solo el propietario puede eliminar la compañía.
 *
 * @async
 * @param {number} companyId - ID de la compañía a eliminar.
 * @returns {Promise<DeleteCompanyResponse>} Confirmación de eliminación.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const deleteCompany = async (companyId: number): Promise<DeleteCompanyResponse> => {
  await httpClient.delete(`/dashboard/company/${companyId}`);
  return { success: true };
};
// #end-function

// #function archiveCompany
/**
 * Archiva una compañía del usuario autenticado.
 * La compañía archivada no aparece en las listas por defecto.
 *
 * @async
 * @param {number} companyId - ID de la compañía a archivar.
 * @returns {Promise<UpdateCompanyResponse>} Datos de la compañía archivada.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const archiveCompany = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.post<{ data: { company: Company; message: string } }>(`/dashboard/company/${companyId}/archive`);
  return { success: true, company: response.data.company };
};
// #end-function

// #function reactivateCompany
/**
 * Reactiva una compañía archivada del usuario autenticado.
 *
 * @async
 * @param {number} companyId - ID de la compañía a reactivar.
 * @returns {Promise<UpdateCompanyResponse>} Datos de la compañía reactivada.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const reactivateCompany = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.post<{ data: { company: Company; message: string } }>(`/dashboard/company/${companyId}/reactivate`);
  return { success: true, company: response.data.company };
};
// #end-function

// #function checkNameAvailability
/**
 * Verifica si un nombre de compañía está disponible.
 * Esta función es útil para validación en tiempo real en formularios.
 *
 * @async
 * @param {string} name - Nombre a verificar.
 * @returns {Promise<CheckNameResponse>} Indica si el nombre está disponible.
 * @throws {Error} Si la solicitud falla.
 */
export const checkNameAvailability = async (name: string): Promise<CheckNameResponse> => {
  const response = await httpClient.get<{ data: { available: boolean } }>(`/dashboard/company/check-name?name=${encodeURIComponent(name)}`);
  return { success: true, available: response.data.available };
};
// #end-function

// #function uploadCompanyLogo
/**
 * Sube o reemplaza el logo de una compañía.
 * Envía el archivo como multipart/form-data al endpoint dedicado de logo.
 *
 * @async
 * @param {number} companyId - ID de la compañía.
 * @param {File} file - Archivo de imagen a subir.
 * @returns {Promise<UpdateCompanyResponse>} Compañía actualizada con la nueva URL del logo.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const uploadCompanyLogo = async (
  companyId: number,
  file: File
): Promise<UpdateCompanyResponse> => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await httpClient.post<{ data: { company: Company; message: string } }>(
    `/dashboard/company/${companyId}/logo`,
    formData
  );
  return { success: true, company: response.data.company };
};
// #end-function

// #function deleteCompanyLogo
/**
 * Elimina el logo de una compañía.
 *
 * @async
 * @param {number} companyId - ID de la compañía.
 * @returns {Promise<UpdateCompanyResponse>} Compañía actualizada sin logo.
 * @throws {Error} Si el usuario no tiene permisos o la compañía no existe.
 */
export const deleteCompanyLogo = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.delete<{ data: { company: Company; message: string } }>(
    `/dashboard/company/${companyId}/logo`
  );
  return { success: true, company: response.data.company };
};
// #end-function

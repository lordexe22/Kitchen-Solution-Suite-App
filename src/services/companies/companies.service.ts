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
  
  return httpClient.get(url);
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
  return httpClient.post('/dashboard/company', companyData);
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
  return httpClient.patch(`/dashboard/company/${companyId}`, companyData);
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
  return httpClient.delete(`/dashboard/company/${companyId}`);
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
  return httpClient.post(`/dashboard/company/${companyId}/archive`);
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
  return httpClient.post(`/dashboard/company/${companyId}/reactivate`);
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
  return httpClient.get(`/dashboard/company/check-name?name=${encodeURIComponent(name)}`);
};
// #end-function

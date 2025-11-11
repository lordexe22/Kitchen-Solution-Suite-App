/* src/services/companies/companies.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { Company, CompanyFormData } from '../../store/Companies.types';
// #end-section
// #function fetchUserCompanies
/**
 * Obtiene todas las compañías del usuario autenticado.
 * 
 * @async
 * @returns {Promise<Company[]>} Lista de compañías
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const companies = await fetchUserCompanies();
 */
export const fetchUserCompanies = async (): Promise<Company[]> => {
  const response = await httpClient.get<{ companies: Company[] }>('/companies');
  return response.companies;
};
// #end-function
// #function createCompany
/**
 * Crea una nueva compañía.
 * 
 * @async
 * @param {CompanyFormData} data - Datos de la compañía a crear
 * @returns {Promise<Company>} Compañía creada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const newCompany = await createCompany({ name: 'Mi Empresa' });
 */
export const createCompany = async (data: CompanyFormData): Promise<Company> => {
  const response = await httpClient.post<{ company: Company }>('/companies', data);
  return response.company;
};
// #end-function
// #function updateCompany
/**
 * Actualiza una compañía existente.
 * 
 * @async
 * @param {number} id - ID de la compañía
 * @param {Partial<CompanyFormData>} updates - Datos a actualizar
 * @returns {Promise<Company>} Compañía actualizada
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const updated = await updateCompany(1, { description: 'Nueva descripción' });
 */
export const updateCompany = async (
  id: number,
  updates: Partial<CompanyFormData>
): Promise<Company> => {
  const response = await httpClient.put<{ company: Company }>(`/companies/${id}`, updates);
  return response.company;
};
// #end-function
// #function deleteCompany
/**
 * Elimina (soft delete) una compañía.
 * 
 * @async
 * @param {number} id - ID de la compañía
 * @returns {Promise<void>}
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * await deleteCompany(1);
 */
export const deleteCompany = async (id: number): Promise<void> => {
  await httpClient.delete(`/companies/${id}`);
};
// #end-function
// #function checkCompanyNameAvailability
/**
 * Verifica si un nombre de compañía está disponible.
 * 
 * @async
 * @param {string} name - Nombre a verificar
 * @returns {Promise<boolean>} true si está disponible, false si ya existe
 * @throws {Error} Si la solicitud falla
 * 
 * @example
 * const isAvailable = await checkCompanyNameAvailability('Mi Empresa');
 */
export const checkCompanyNameAvailability = async (name: string): Promise<boolean> => {
  const response = await httpClient.post<{ available: boolean }>('/companies/check-name', { name });
  return response.available;
};
// #end-function
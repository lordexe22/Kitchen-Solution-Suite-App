/* src/services/companies/companies.service.ts */
// #section imports
import { fetchWithTimeout } from '../../utils/fetchWithTimeout/fetchWithTimeout';
import type { Company, CompanyFormData } from '../../store/Companies.types';
// #end-section

// #variable BASE_URL
const BASE_URL = 'http://localhost:4000/api/companies';
// #end-variable

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
  const response = await fetchWithTimeout(
    BASE_URL,
    {
      method: 'GET',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al obtener compañías');
  }

  return responseData.data.companies;
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
  const response = await fetchWithTimeout(
    BASE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al crear compañía');
  }

  return responseData.data.company;
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
  const response = await fetchWithTimeout(
    `${BASE_URL}/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al actualizar compañía');
  }

  return responseData.data.company;
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
  const response = await fetchWithTimeout(
    `${BASE_URL}/${id}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al eliminar compañía');
  }
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
  const response = await fetchWithTimeout(
    `${BASE_URL}/check-name`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name }),
    },
    10000
  );

  const responseData = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Error al verificar disponibilidad');
  }

  return responseData.data.available;
};
// #end-function
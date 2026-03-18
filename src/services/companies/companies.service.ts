// src/services/companies/companies.service.ts
// #section Imports
import type { Company, CompanyFormData } from '../../types/companies.types';
import { httpClient } from '../../api/httpClient.instance';
import type { GetAllCompaniesParams, GetAllCompaniesResponse, CreateCompanyResponse, UpdateCompanyResponse, DeleteCompanyResponse, CheckNameResponse } from './companies.types';
// #end-section

// #function getAllCompanies
/**
 * @description Obtiene todas las compañías del usuario autenticado con filtrado y paginación.
 * @purpose Proveer al dashboard una lista de compañías paginada y filtrable por estado.
 * @context Utilizado por CompaniesPanel para cargar y actualizar la lista de compañías del usuario.
 * @param params parámetros de filtrado y paginación (estado, página, límite)
 * @returns lista de compañías con metadata de paginación
 * @throws Error si el token JWT no es válido o la solicitud falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
 * @description Crea una nueva compañía asociada al usuario autenticado.
 * @purpose Permitir al usuario registrar una nueva compañía en el sistema.
 * @context El backend valida el JWT y asocia automáticamente la compañía con el userId del token.
 * @param companyData datos del formulario de la compañía a crear
 * @returns datos de la compañía recién creada
 * @throws Error si el nombre ya existe o la validación falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const createCompany = async (companyData: CompanyFormData): Promise<CreateCompanyResponse> => {
  const response = await httpClient.post<{ data: Company }>('/dashboard/company', companyData);
  return { success: true, company: response.data };
};
// #end-function

// #function updateCompany
/**
 * @description Actualiza los datos de una compañía existente del usuario autenticado.
 * @purpose Permitir la edición parcial o total de los datos de una compañía.
 * @context Solo el propietario de la compañía puede modificarla. Utilizado en modales de edición.
 * @param companyId ID de la compañía a actualizar
 * @param companyData campos del formulario a actualizar (puede ser parcial)
 * @returns datos de la compañía actualizada
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
 * @description Elimina permanentemente una compañía del usuario autenticado.
 * @purpose Proveer la operación de borrado definitivo de una compañía del sistema.
 * @context Solo el propietario puede eliminar la compañía. Utilizado en el panel de gestión de compañías.
 * @param companyId ID de la compañía a eliminar
 * @returns confirmación de eliminación exitosa
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const deleteCompany = async (companyId: number): Promise<DeleteCompanyResponse> => {
  await httpClient.delete(`/dashboard/company/${companyId}`);
  return { success: true };
};
// #end-function

// #function archiveCompany
/**
 * @description Archiva una compañía, ocultándola de las listas activas por defecto.
 * @purpose Proveer una alternativa a la eliminación definitiva que preserve los datos históricos.
 * @context Utilizado en el panel de gestión de compañías como operación de archivado suave.
 * @param companyId ID de la compañía a archivar
 * @returns datos de la compañía archivada
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const archiveCompany = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.post<{ data: { company: Company; message: string } }>(`/dashboard/company/${companyId}/archive`);
  return { success: true, company: response.data.company };
};
// #end-function

// #function reactivateCompany
/**
 * @description Reactiva una compañía previamente archivada.
 * @purpose Restaurar una compañía archivada al estado activo para que vuelva a aparecer en las listas.
 * @context Utilizado en el panel de compañías archivadas como operación de restauración.
 * @param companyId ID de la compañía a reactivar
 * @returns datos de la compañía reactivada
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const reactivateCompany = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.post<{ data: { company: Company; message: string } }>(`/dashboard/company/${companyId}/reactivate`);
  return { success: true, company: response.data.company };
};
// #end-function

// #function checkNameAvailability
/**
 * @description Verifica si un nombre de compañía está disponible para su uso.
 * @purpose Habilitar la validación en tiempo real del nombre de compañía en formularios de creación/edición.
 * @context Utilizado en el formulario de creación/edición de compañías para evitar duplicados antes de enviar.
 * @param name nombre a verificar contra los registros existentes
 * @returns indicador de disponibilidad del nombre
 * @throws Error si la solicitud al servidor falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const checkNameAvailability = async (name: string): Promise<CheckNameResponse> => {
  const response = await httpClient.get<{ data: { available: boolean } }>(`/dashboard/company/check-name?name=${encodeURIComponent(name)}`);
  return { success: true, available: response.data.available };
};
// #end-function

// #function uploadCompanyLogo
/**
 * @description Sube o reemplaza el logo de una compañía enviando el archivo como multipart/form-data.
 * @purpose Permitir a los usuarios personalizar la imagen de su compañía en el sistema.
 * @context Utilizado en el modal de edición de compañía al seleccionar y confirmar un nuevo logo.
 * @param companyId ID de la compañía a la que se asocia el logo
 * @param file archivo de imagen a subir
 * @returns compañía actualizada con la nueva URL del logo
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
 * @description Elimina el logo de una compañía.
 * @purpose Permitir al usuario remover la imagen de su compañía sin afectar otros datos.
 * @context Utilizado en el modal de edición de compañía al confirmar la eliminación del logo actual.
 * @param companyId ID de la compañía cuyo logo se eliminará
 * @returns compañía actualizada sin logo asignado
 * @throws Error si el usuario no tiene permisos o la compañía no existe
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const deleteCompanyLogo = async (companyId: number): Promise<UpdateCompanyResponse> => {
  const response = await httpClient.delete<{ data: { company: Company; message: string } }>(
    `/dashboard/company/${companyId}/logo`
  );
  return { success: true, company: response.data.company };
};
// #end-function

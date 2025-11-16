// src/services/companies/companyLogo.service.ts

import { httpClient } from '../../api/httpClient.instance';
import type { Company } from '../../store/Companies.types';

// #function uploadCompanyLogo
/**
 * Sube o actualiza el logo de una compañía.
 * 
 * @param companyId - ID de la compañía
 * @param file - Archivo de imagen a subir
 * @returns Compañía actualizada con la nueva URL del logo
 * 
 * @example
 * const file = input.files[0];
 * const updatedCompany = await uploadCompanyLogo(1, file);
 */
export const uploadCompanyLogo = async (
  companyId: number,
  file: File
): Promise<Company> => {
  // Crear FormData para enviar el archivo
  const formData = new FormData();
  formData.append('logo', file);

  // Hacer petición con FormData
  const response = await fetch(`http://localhost:4000/api/companies/${companyId}/logo`, {
    method: 'POST',
    credentials: 'include', // Incluir cookies (JWT)
    body: formData, // No setear Content-Type, el browser lo hace automáticamente
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload logo');
  }

  const data = await response.json();
  return data.data.company;
};
// #end-function

// #function deleteCompanyLogo
/**
 * Elimina el logo de una compañía.
 * 
 * @param companyId - ID de la compañía
 * @returns Compañía actualizada sin logo
 * 
 * @example
 * const updatedCompany = await deleteCompanyLogo(1);
 */
export const deleteCompanyLogo = async (companyId: number): Promise<Company> => {
  const response = await httpClient.delete<{ company: Company }>(
    `/companies/${companyId}/logo`
  );
  return response.company;
};
// #end-function
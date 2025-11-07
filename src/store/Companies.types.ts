/* src/types/companies.types.ts */

// #interface Company
/**
 * Representa una compañía en el frontend.
 * Replica la estructura de la tabla companies del backend.
 */
export interface Company {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  logoUrl: string | null;
  createdAt: string; // En frontend las fechas vienen como string del JSON
  updatedAt: string;
  isActive: boolean;
  deletedAt: string | null;
}
// #end-interface

// #type CompanyFormData
/**
 * Datos del formulario para crear/editar una compañía.
 */
export type CompanyFormData = {
  name: string;
  description?: string;
  logoUrl?: string;
};
// #end-type

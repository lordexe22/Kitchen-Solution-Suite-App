/* src/types/companies.types.ts */

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
  state: 'active' | 'archived'; // Actualizado para coincidir con el backend
  archivedAt: string | null; // Actualizado para coincidir con el backend
  createdAt: string; // En frontend las fechas vienen como string del JSON
  updatedAt: string;
}

/**
 * Datos del formulario para crear/editar una compañía.
 */
export type CompanyFormData = {
  name: string;
  description?: string;
  logoUrl?: string;
};

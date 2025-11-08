/* src/store/Branches.types.ts */

// #interface Branch
/**
 * Representa una sucursal en el frontend.
 * Replica la estructura de la tabla branches del backend.
 */
export interface Branch {
  id: number;
  companyId: number;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  deletedAt: string | null;
}
// #end-interface

// #interface BranchLocation
/**
 * Representa la ubicación física de una sucursal.
 */
export interface BranchLocation {
  id: number;
  branchId: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: string;
  updatedAt: string;
}
// #end-interface

// #interface BranchWithLocation
/**
 * Sucursal con su ubicación incluida (puede ser null si no tiene ubicación).
 */
export interface BranchWithLocation extends Branch {
  location: BranchLocation | null;
}
// #end-interface

// #type BranchFormData
/**
 * Datos del formulario para crear/actualizar una sucursal.
 */
export type BranchFormData = {
  companyId: number;
  name?: string | null;
};
// #end-type

// #type BranchLocationFormData
/**
 * Datos del formulario para crear/actualizar una ubicación.
 */
export type BranchLocationFormData = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
};
// #end-type
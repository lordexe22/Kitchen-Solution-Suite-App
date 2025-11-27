/* src/services/public/menu.types.ts */
// #section Imports
import type { Category } from '../../store/Categories.types';
import type { Product } from '../../store/Products.types';
import type { Branch } from '../../store/Branches.types';
import type { BranchSchedule, BranchSocial } from '../../store/Branches.types';
// #end-section

// #interface PublicCategory
/**
 * Categoría con productos incluidos para vista pública.
 */
export interface PublicCategory extends Category {
  products: Product[];
}
// #end-interface

// #interface PublicBranchMenu
/**
 * Respuesta del endpoint de menú público.
 */
export interface PublicBranchMenu {
  branch: Branch;
  categories: PublicCategory[];
}
// #end-interface

// #interface PublicCompanyInfo
/**
 * Información de la compañía (solo datos públicos).
 */
export interface PublicCompanyInfo {
  id: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
}
// #end-interface

// #interface PublicBranchInfo
/**
 * Información completa de la sucursal para vista pública.
 */
export interface PublicBranchInfo {
  branch: Branch;
  company: PublicCompanyInfo;
  schedules: BranchSchedule[];
  socials: BranchSocial[];
}
// #end-interface

// #interface PublicProductDetail
/**
 * Detalle completo de un producto para vista pública.
 */
export interface PublicProductDetail {
  product: Product;
  category: Category;
  branch: Branch;
}
// #end-interface
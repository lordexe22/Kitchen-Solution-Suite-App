/* src/store/Categories.types.ts */

// #type BackgroundMode
/**
 * Modo de fondo: sólido o gradiente.
 */
export type BackgroundMode = 'solid' | 'gradient';
// #end-type

// #type GradientType
/**
 * Tipos de gradiente disponibles.
 */
export type GradientType = 'linear' | 'radial';
// #end-type

// #type GradientColors
/**
 * Array de 2 a 4 colores para el gradiente.
 * DEBE coincidir con el tipo del categoryCreator.
 */
export type GradientColors = 
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];
// #end-type

// #interface GradientConfig
/**
 * Configuración de un gradiente almacenada en la BD.
 */
export interface GradientConfig {
  type: GradientType;
  angle: number;
  colors: GradientColors;
}
// #end-interface

// #interface Category
/**
 * Representa una categoría en el frontend.
 * Replica la estructura de la tabla categories del backend.
 */
export interface Category {
  id: number;
  branchId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  textColor: string;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  gradientConfig: string | null; // JSON string desde la BD
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
// #end-interface

// #interface CategoryWithParsedGradient
/**
 * Categoría con el gradientConfig ya parseado.
 * Es la que se usa en la UI.
 */
export interface CategoryWithParsedGradient extends Omit<Category, 'gradientConfig'> {
  gradient?: GradientConfig;
}
// #end-interface

// #type CategoryFormData
/**
 * Datos del formulario para crear/actualizar una categoría.
 */
export type CategoryFormData = {
  branchId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  textColor?: string;
  backgroundMode?: BackgroundMode;
  backgroundColor?: string;
  gradient?: GradientConfig;
};
// #end-type

// #interface CategoryImportSummary
/**
 * Resumen de una importación de categoría.
 */
export interface CategoryImportSummary {
  categoryName: string;
  originalName: string;
  wasRenamed: boolean;
  productsImported: number;
}
// #end-interface

// #interface CategoryImportResponse
/**
 * Respuesta del backend al importar una categoría.
 */
export interface CategoryImportResponse {
  category: Category;
  products: Array<{
    id: number;
    name: string;
    categoryId: number;
  }>;
  summary: CategoryImportSummary;
}
// #end-interface

// #function parseCategoryGradient
/**
 * Parsea el gradientConfig de string JSON a objeto.
 * 
 * @param category - Categoría con gradientConfig como string
 * @returns Categoría con gradient parseado
 */
export function parseCategoryGradient(category: Category): CategoryWithParsedGradient {
  const { gradientConfig, ...rest } = category;
  
  let gradient: GradientConfig | undefined;
  if (gradientConfig) {
    try {
      gradient = JSON.parse(gradientConfig);
    } catch (error) {
      console.error('Error parsing gradient config:', error);
    }
  }
  
  return {
    ...rest,
    gradient
  };
}
// #end-function
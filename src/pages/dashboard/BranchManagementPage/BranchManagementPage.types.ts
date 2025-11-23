// src/pages/dashboard/BranchManagementPage/BranchManagementPage.types.ts

/**
 * Tipos de sección disponibles en la página de gestión de sucursales
 */
export type SectionType = 'schedules' | 'socials' | 'products';

/**
 * Props base que todas las secciones deben recibir
 */
export interface BranchSectionProps {
  companyId: number;
  onError?: (error: string) => void;
  onClearError?: () => void;
}

/**
 * Configuración para cada sección disponible
 */
export interface SectionConfig {
  id: SectionType;
  title: string;
  subtitle: string;
  icon: string;
  path: string;
}

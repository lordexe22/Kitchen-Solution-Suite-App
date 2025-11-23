// src/pages/dashboard/BranchManagementPage/BranchManagementPage.config.ts

import type { SectionConfig } from './BranchManagementPage.types';

/**
 * Configuración de todas las secciones disponibles
 * Sirve como fuente única de verdad para secciones
 */
export const SECTION_CONFIGS: Record<string, SectionConfig> = {
  schedules: {
    id: 'schedules',
    title: '🕐 Horarios de Atención',
    subtitle: 'Configura los horarios de todas tus sucursales. Click en cada día para editar.',
    icon: '🕐',
    path: '/dashboard/branches/schedules',
  },
  socials: {
    id: 'socials',
    title: '🌐 Redes Sociales',
    subtitle: 'Configura las redes sociales de todas tus sucursales. Click en cada plataforma para editar.',
    icon: '🌐',
    path: '/dashboard/branches/socials',
  },
  products: {
    id: 'products',
    title: '🍽️ Productos y Categorías',
    subtitle: 'Crea categorías para organizar tus productos por sucursal.',
    icon: '📦',
    path: '/dashboard/branches/products',
  },
};

/**
 * Obtiene la configuración de una sección por su ID
 */
export const getSectionConfig = (sectionId: string | undefined): SectionConfig => {
  if (!sectionId || !SECTION_CONFIGS[sectionId]) {
    return SECTION_CONFIGS.schedules; // Por defecto: schedules
  }
  return SECTION_CONFIGS[sectionId];
};

/**
 * Valida si un string es una sección válida
 */
export const isValidSection = (section: string | undefined): section is string => {
  return section ? Object.keys(SECTION_CONFIGS).includes(section) : false;
};

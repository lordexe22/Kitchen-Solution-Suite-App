// src/pages/dashboard/BranchManagementPage/useSelectedSection.ts

import { useParams } from 'react-router-dom';
import { getSectionConfig, isValidSection } from './BranchManagementPage.config';
import type { SectionType } from './BranchManagementPage.types';

/**
 * Hook para gestionar la sección activa basada en URL params
 * Proporciona la sección actual y su configuración
 */
export const useSelectedSection = (defaultSection: SectionType = 'schedules') => {
  const { section } = useParams<{ section?: string }>();

  // Validar que la sección es válida
  const activeSection = isValidSection(section) ? (section as SectionType) : defaultSection;
  const sectionConfig = getSectionConfig(activeSection);

  return {
    activeSection,
    sectionConfig,
  };
};

/* src/modules/categoryCreator/index.ts */

// #section Exportaciones principales
export { CategoryCreatorModal } from './categoryCreator';
export { useCategoryCreator } from './categoryCreator.hooks';
// #end-section

// #section Exportación de tipos
export type {
  CategoryConfiguration,
  BackgroundMode,
  GradientType,
  GradientColors,
  GradientConfig,
  CategoryCreatorModalProps,
  GradientPreset
} from './categoryCreator.types';
// #end-section

// #section Exportación de utilidades
export {
  validateCategoryConfiguration,
  isValidHexColor,
  generateGradientCSS,
  generateBackgroundCSS,
  getContrastColor,
  getContrastColorForGradient,
  exportCategoryConfiguration,
  importCategoryConfiguration
} from './categoryCreator.utils';
// #end-section

// #section Exportación de configuración (opcional)
export {
  DEFAULT_CATEGORY_CONFIG,
  GRADIENT_PRESETS,
  ANGLE_PRESETS
} from './categoryCreator.config';
// #end-section
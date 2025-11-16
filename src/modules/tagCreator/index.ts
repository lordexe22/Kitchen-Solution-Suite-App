/* src/modules/tagCreator/index.ts */

// #section Exportaciones principales
export { TagCreatorModal } from './tagCreator';
export { useTagCreator } from './tagCreator.hooks';
// #end-section

// #section Exportación de tipos
export type {
  TagConfiguration,
  TagSize,
  TagCreatorModalProps
} from './tagCreator.types';
// #end-section

// #section Exportación de utilidades
export {
  validateTagConfiguration,
  isValidHexColor,
  getContrastColor,
  suggestBackgroundColor,
  generateTagCSS,
  exportTagConfiguration,
  importTagConfiguration
} from './tagCreator.utils';
// #end-section

// #section Exportación de configuración (opcional)
export {
  DEFAULT_TAG_CONFIG,
  TAG_SIZES,
  PRESET_ICONS
} from './tagCreator.config';
// #end-section
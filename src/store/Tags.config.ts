/* src/store/Tags.config.ts */
// #section imports
import type { TagConfiguration } from '../modules/tagCreator';
// #end-section

// #constant SYSTEM_TAGS
/**
 * Tags predeterminados del sistema.
 * Estos tags están siempre disponibles y no se pueden eliminar.
 * 
 * Categorías:
 * - Restricciones Dietéticas
 * - Nivel de Picor
 * - Destacados
 * - Promociones
 * - Características
 */
export const SYSTEM_TAGS: TagConfiguration[] = [
  // Restricciones Dietéticas
  {
    name: 'Vegetariano',
    textColor: '#10B981',
    backgroundColor: '#D1FAE5',
    icon: '🌱',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Vegano',
    textColor: '#059669',
    backgroundColor: '#A7F3D0',
    icon: '🥗',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Sin TACC',
    textColor: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    icon: '🍞',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Sin Lactosa',
    textColor: '#06B6D4',
    backgroundColor: '#CFFAFE',
    icon: '🥛',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Keto',
    textColor: '#14B8A6',
    backgroundColor: '#CCFBF1',
    icon: '🥑',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Proteico',
    textColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
    icon: '💪',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Light',
    textColor: '#60A5FA',
    backgroundColor: '#DBEAFE',
    icon: '🪶',
    hasBorder: true,
    size: 'medium'
  },
  
  // Nivel de Picor
  {
    name: 'Picante',
    textColor: '#EF4444',
    backgroundColor: '#FEE2E2',
    icon: '🌶️',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Muy Picante',
    textColor: '#DC2626',
    backgroundColor: '#FEE2E2',
    icon: '🔥',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Suave',
    textColor: '#34D399',
    backgroundColor: '#D1FAE5',
    icon: '😌',
    hasBorder: true,
    size: 'medium'
  },
  
  // Destacados
  {
    name: 'Recomendado',
    textColor: '#FBBF24',
    backgroundColor: '#FEF3C7',
    icon: '⭐',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Popular',
    textColor: '#F97316',
    backgroundColor: '#FFEDD5',
    icon: '🔥',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Nuevo',
    textColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
    icon: '🆕',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'De la Casa',
    textColor: '#EC4899',
    backgroundColor: '#FCE7F3',
    icon: '👨‍🍳',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Premium',
    textColor: '#A855F7',
    backgroundColor: '#F3E8FF',
    icon: '💎',
    hasBorder: true,
    size: 'medium'
  },
  
  // Promociones
  {
    name: 'Promoción',
    textColor: '#EC4899',
    backgroundColor: '#FCE7F3',
    icon: '💰',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Descuento',
    textColor: '#F43F5E',
    backgroundColor: '#FFE4E6',
    icon: '🎁',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: '2x1',
    textColor: '#FB923C',
    backgroundColor: '#FFEDD5',
    icon: '🎉',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Oferta',
    textColor: '#EAB308',
    backgroundColor: '#FEF9C3',
    icon: '⚡',
    hasBorder: true,
    size: 'medium'
  },
  
  // Características
  {
    name: 'Artesanal',
    textColor: '#A3E635',
    backgroundColor: '#ECFCCB',
    icon: '🏠',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Casero',
    textColor: '#FB923C',
    backgroundColor: '#FFEDD5',
    icon: '🍳',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Importado',
    textColor: '#0EA5E9',
    backgroundColor: '#E0F2FE',
    icon: '✈️',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Para Compartir',
    textColor: '#F472B6',
    backgroundColor: '#FCE7F3',
    icon: '👥',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Maridaje',
    textColor: '#BE123C',
    backgroundColor: '#FFE4E6',
    icon: '🍷',
    hasBorder: true,
    size: 'medium'
  },
  {
    name: 'Frío',
    textColor: '#38BDF8',
    backgroundColor: '#E0F2FE',
    icon: '🌡️',
    hasBorder: true,
    size: 'medium'
  }
];
// #end-constant
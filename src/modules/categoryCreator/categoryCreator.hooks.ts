/* src/modules/categoryCreator/categoryCreator.hooks.ts */

// #section Imports
import { useState, useCallback, useMemo } from 'react';
import type { 
  CategoryConfiguration, 
  BackgroundMode, 
  GradientType, 
  GradientColors,
  GradientConfig,
  UseCategoryCreatorReturn 
} from './categoryCreator.types';
import { DEFAULT_CATEGORY_CONFIG } from './categoryCreator.config';
import { validateCategoryConfiguration } from './categoryCreator.utils';
// #end-section

// #hook useCategoryCreator
/**
 * Hook personalizado para manejar la creación/edición de categorías.
 * 
 * Proporciona todas las funciones necesarias para crear/editar
 * una configuración de categoría.
 * 
 * @param initialConfig - Configuración inicial (opcional)
 * @returns Objeto con estado y funciones
 * 
 * @example
 * const {
 *   config,
 *   setName,
 *   setBackgroundMode,
 *   isValid
 * } = useCategoryCreator();
 */
export function useCategoryCreator(
  initialConfig?: CategoryConfiguration
): UseCategoryCreatorReturn {
  
  // #state config
  const [config, setConfig] = useState<CategoryConfiguration>(
    initialConfig || DEFAULT_CATEGORY_CONFIG
  );
  // #end-state
  
  // #function setName
  const setName = useCallback((name: string) => {
    setConfig(prev => ({ ...prev, name }));
  }, []);
  // #end-function
  
  // #function setDescription
  const setDescription = useCallback((description: string | undefined) => {
    setConfig(prev => ({ ...prev, description }));
  }, []);
  // #end-function
  
  // #function setImageUrl
  const setImageUrl = useCallback((imageUrl: string | undefined) => {
    setConfig(prev => ({ ...prev, imageUrl }));
  }, []);
  // #end-function
  
  // #function setTextColor
  const setTextColor = useCallback((textColor: string) => {
    setConfig(prev => ({ ...prev, textColor }));
  }, []);
  // #end-function
  
  // #function setBackgroundMode
  const setBackgroundMode = useCallback((backgroundMode: BackgroundMode) => {
    setConfig(prev => ({ ...prev, backgroundMode }));
  }, []);
  // #end-function
  
  // #function setBackgroundColor
  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setConfig(prev => ({ ...prev, backgroundColor }));
  }, []);
  // #end-function
  
  // #function setGradientType
  const setGradientType = useCallback((type: GradientType) => {
    setConfig(prev => ({
      ...prev,
      gradient: prev.gradient ? { ...prev.gradient, type } : undefined
    }));
  }, []);
  // #end-function
  
  // #function setGradientAngle
  const setGradientAngle = useCallback((angle: number) => {
    setConfig(prev => ({
      ...prev,
      gradient: prev.gradient ? { ...prev.gradient, angle } : undefined
    }));
  }, []);
  // #end-function
  
  // #function setGradientColors
  const setGradientColors = useCallback((colors: GradientColors) => {
    setConfig(prev => ({
      ...prev,
      gradient: prev.gradient ? { ...prev.gradient, colors } : undefined
    }));
  }, []);
  // #end-function
  
  // #function applyGradientPreset
  const applyGradientPreset = useCallback((preset: GradientConfig) => {
    setConfig(prev => ({
      ...prev,
      backgroundMode: 'gradient',
      gradient: preset
    }));
  }, []);
  // #end-function
  
  // #function reset
  const reset = useCallback(() => {
    setConfig(initialConfig || DEFAULT_CATEGORY_CONFIG);
  }, [initialConfig]);
  // #end-function
  
  // #memo errors
  const errors = useMemo(() => {
    return validateCategoryConfiguration(config);
  }, [config]);
  // #end-memo
  
  // #memo isValid
  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);
  // #end-memo
  
  return {
    config,
    setName,
    setDescription,
    setImageUrl,
    setTextColor,
    setBackgroundMode,
    setBackgroundColor,
    setGradientType,
    setGradientAngle,
    setGradientColors,
    applyGradientPreset,
    reset,
    isValid,
    errors
  };
}
// #end-hook
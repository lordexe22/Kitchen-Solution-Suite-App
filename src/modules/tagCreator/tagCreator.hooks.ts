/* src/modules/tagCreator/tagCreator.hooks.ts */

// #section Imports
import { useState, useCallback, useMemo } from 'react';
import type { TagConfiguration, TagSize } from './tagCreator.types';
import { DEFAULT_TAG_CONFIG } from './tagCreator.config';
import { validateTagConfiguration } from './tagCreator.utils';
// #end-section

// #interface UseTagCreatorReturn
/**
 * Retorno del hook useTagCreator.
 */
export interface UseTagCreatorReturn {
  config: TagConfiguration;
  setName: (name: string) => void;
  setTextColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setIcon: (icon: string | undefined) => void;
  toggleBorder: () => void;
  setSize: (size: TagSize) => void;
  reset: () => void;
  isValid: boolean;
  errors: string[];
}
// #end-interface

// #hook useTagCreator
/**
 * Hook principal para gestionar el estado del TagCreator.
 * 
 * Proporciona todas las funciones necesarias para crear/editar
 * una configuración de etiqueta.
 * 
 * @param initialConfig - Configuración inicial (opcional)
 * @returns Objeto con estado y funciones
 * 
 * @example
 * const {
 *   config,
 *   setName,
 *   setTextColor,
 *   isValid
 * } = useTagCreator();
 */
export function useTagCreator(
  initialConfig?: TagConfiguration
): UseTagCreatorReturn {
  
  // #state config
  const [config, setConfig] = useState<TagConfiguration>(
    initialConfig || DEFAULT_TAG_CONFIG
  );
  // #end-state
  
  // #function setName
  const setName = useCallback((name: string) => {
    setConfig(prev => ({ ...prev, name }));
  }, []);
  // #end-function
  
  // #function setTextColor
  const setTextColor = useCallback((textColor: string) => {
    setConfig(prev => ({ ...prev, textColor }));
  }, []);
  // #end-function
  
  // #function setBackgroundColor
  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setConfig(prev => ({ ...prev, backgroundColor }));
  }, []);
  // #end-function
  
  // #function setIcon
  const setIcon = useCallback((icon: string | undefined) => {
    setConfig(prev => ({ ...prev, icon }));
  }, []);
  // #end-function
  
  // #function toggleBorder
  const toggleBorder = useCallback(() => {
    setConfig(prev => ({ ...prev, hasBorder: !prev.hasBorder }));
  }, []);
  // #end-function
  
  // #function setSize
  const setSize = useCallback((size: TagSize) => {
    setConfig(prev => ({ ...prev, size }));
  }, []);
  // #end-function
  
  // #function reset
  const reset = useCallback(() => {
    setConfig(initialConfig || DEFAULT_TAG_CONFIG);
  }, [initialConfig]);
  // #end-function
  
  // #memo errors
  const errors = useMemo(() => {
    return validateTagConfiguration(config);
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
    setTextColor,
    setBackgroundColor,
    setIcon,
    toggleBorder,
    setSize,
    reset,
    isValid,
    errors
  };
}
// #end-hook
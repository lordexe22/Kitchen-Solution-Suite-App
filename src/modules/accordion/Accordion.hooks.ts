/* src/modules/accordion/Accordion.hooks.ts */
// #section Imports
import { useState, useCallback } from 'react';
// #end-section
// #hook useAccordionState
/**
 * Hook para gestionar el estado de expansión del acordeón.
 * Soporta dos modos:
 * - Estado interno: usa defaultExpanded y mantiene estado propio
 * - Estado controlado: usa isExpanded y onToggle del padre
 * 
 * @param {boolean} defaultExpanded - Estado inicial de expansión (modo interno)
 * @param {boolean | undefined} isExpandedProp - Estado controlado desde el padre
 * @param {function | undefined} onToggleProp - Callback al cambiar estado
 * @param {string | undefined} id - ID del acordeón para pasar al callback
 * @param {boolean} disabled - Si el acordeón está deshabilitado
 * @returns {object} Estado y handler de toggle
 */
export const useAccordionState = (
  defaultExpanded: boolean,
  isExpandedProp: boolean | undefined,
  onToggleProp: ((isExpanded: boolean, id?: string) => void) | undefined,
  id: string | undefined,
  disabled: boolean
) => {
  // #const isControlled
  // Determinar si el componente está en modo controlado
  const isControlled = isExpandedProp !== undefined;
  // #end-const

  // #state isExpandedInternal
  // Estado interno (solo se usa en modo no controlado)
  const [isExpandedInternal, setIsExpandedInternal] = useState(defaultExpanded);
  // #end-state

  // #const isExpanded
  // Usar estado controlado si está disponible, sino usar interno
  const isExpanded = isControlled ? isExpandedProp : isExpandedInternal;
  // #end-const

  // #function handleToggle
  /**
   * Maneja el toggle de expansión del acordeón.
   * Si está controlado, llama al callback del padre.
   * Si no, actualiza el estado interno.
   */
  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newState = !isExpanded;

    if (isControlled) {
      // Modo controlado: notificar al padre
      onToggleProp?.(newState, id);
    } else {
      // Modo interno: actualizar estado local
      setIsExpandedInternal(newState);
      // Notificar cambio si hay callback
      onToggleProp?.(newState, id);
    }
  }, [disabled, isExpanded, isControlled, onToggleProp, id]);
  // #end-function

  // #section Return
  return { isExpanded, handleToggle };
  // #end-section
};
// #end-hook
// #hook useAccordionKeyboard
/**
 * Hook para manejar eventos de teclado del acordeón.
 * @param {function} handleToggle - Handler de toggle
 * @returns {function} Handler de keydown
 */
export const useAccordionKeyboard = (handleToggle: () => void) => {
  // #function handleKeyDown
  /**
   * Maneja eventos de teclado en el header (Enter y Space).
   * Previene scroll y ejecuta toggle.
   * @param {React.KeyboardEvent} e - Evento de teclado
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);
  // #end-function
  // #section Return
  return handleKeyDown;
  // #end-section
};
// #end-hook

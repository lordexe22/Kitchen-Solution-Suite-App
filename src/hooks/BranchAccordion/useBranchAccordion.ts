// src/hooks/BranchAccordion/useBranchAccordion.ts

import { useContext } from 'react';
import { BranchAccordionContext, type BranchAccordionContextType } from './context';

/**
 * Hook para usar el contexto de acordeones de sucursales
 * Debe ser usado dentro de un BranchAccordionProvider
 *
 * @returns {BranchAccordionContextType} Métodos para gestionar estado de acordeones
 * @throws {Error} Si se usa fuera de BranchAccordionProvider
 *
 * @example
 * ```tsx
 * const accordion = useBranchAccordion();
 * accordion.toggleBranch(branchId);
 * ```
 */
export const useBranchAccordion = (): BranchAccordionContextType => {
  const context = useContext(BranchAccordionContext);
  if (context === undefined) {
    throw new Error('useBranchAccordion must be used within a BranchAccordionProvider');
  }
  return context;
};

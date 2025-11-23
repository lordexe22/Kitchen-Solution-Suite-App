// src/hooks/BranchAccordion/BranchAccordionProvider.tsx

import React, { useState, useCallback } from 'react';
import { BranchAccordionContext, type BranchAccordionContextType } from './context';

/**
 * Provider para el contexto de acordeones de sucursales
 * Debe envolver el árbol de componentes que necesita acceder al estado de acordeones
 *
 * @example
 * ```tsx
 * <BranchAccordionProvider>
 *   <YourComponent />
 * </BranchAccordionProvider>
 * ```
 */
export const BranchAccordionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openBranches, setOpenBranches] = useState<Set<number>>(new Set());

  const toggleBranch = useCallback((branchId: number) => {
    setOpenBranches((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(branchId)) {
        newSet.delete(branchId);
      } else {
        newSet.add(branchId);
      }
      return newSet;
    });
  }, []);

  const openBranch = useCallback((branchId: number) => {
    setOpenBranches((prev) => {
      const newSet = new Set(prev);
      newSet.add(branchId);
      return newSet;
    });
  }, []);

  const closeBranch = useCallback((branchId: number) => {
    setOpenBranches((prev) => {
      const newSet = new Set(prev);
      newSet.delete(branchId);
      return newSet;
    });
  }, []);

  const isBranchOpen = useCallback((branchId: number) => {
    return openBranches.has(branchId);
  }, [openBranches]);

  const clearAllBranches = useCallback(() => {
    setOpenBranches(new Set());
  }, []);

  const value: BranchAccordionContextType = {
    openBranches,
    toggleBranch,
    openBranch,
    closeBranch,
    isBranchOpen,
    clearAllBranches,
  };

  return <BranchAccordionContext.Provider value={value}>{children}</BranchAccordionContext.Provider>;
};

// src/hooks/BranchAccordion/context.ts

import { createContext } from 'react';

/**
 * Context para mantener el estado de qué sucursales están abiertas
 * Esto permite que al cambiar de sección, los acordeones permanezcan abiertos
 */

export interface BranchAccordionContextType {
  openBranches: Set<number>;
  toggleBranch: (branchId: number) => void;
  openBranch: (branchId: number) => void;
  closeBranch: (branchId: number) => void;
  isBranchOpen: (branchId: number) => boolean;
  clearAllBranches: () => void;
}

// Context object - used internally by provider and hook
export const BranchAccordionContext = createContext<BranchAccordionContextType | undefined>(undefined);

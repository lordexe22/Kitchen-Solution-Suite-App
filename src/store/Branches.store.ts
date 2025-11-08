/* src/store/Branches.store.ts */
// #section imports
import { create } from 'zustand';
import type { BranchWithLocation } from './Branches.types';
// #end-section

// #interface BranchesStore
/**
 * Store de Branches usando Zustand.
 * Organiza sucursales por companyId para fácil acceso.
 * Solo maneja estado, NO hace fetching (eso lo hace el service).
 */
interface BranchesStore {
  // Estado: { companyId: branches[] }
  branchesByCompany: Record<number, BranchWithLocation[]>;
  
  // Setters
  setBranchesForCompany: (companyId: number, branches: BranchWithLocation[]) => void;
  addBranch: (branch: BranchWithLocation) => void;
  updateBranch: (branchId: number, updates: Partial<BranchWithLocation>) => void;
  removeBranch: (branchId: number, companyId: number) => void;
  clearAllBranches: () => void;
  
  // Helpers
  getBranchesForCompany: (companyId: number) => BranchWithLocation[];
  hasBranchesForCompany: (companyId: number) => boolean;
}
// #end-interface

// #store useBranchesStore
/**
 * Hook del store de Branches.
 * 
 * @example
 * const { branchesByCompany, setBranchesForCompany } = useBranchesStore();
 */
export const useBranchesStore = create<BranchesStore>((set, get) => ({
  // Estado inicial
  branchesByCompany: {},
  
  // Setter: Establecer sucursales de una compañía
  setBranchesForCompany: (companyId, branches) => set((state) => ({
    branchesByCompany: {
      ...state.branchesByCompany,
      [companyId]: branches
    }
  })),
  
  // Setter: Agregar una sucursal
  addBranch: (branch) => set((state) => {
    const companyBranches = state.branchesByCompany[branch.companyId] || [];
    return {
      branchesByCompany: {
        ...state.branchesByCompany,
        [branch.companyId]: [...companyBranches, branch]
      }
    };
  }),
  
  // Setter: Actualizar una sucursal
  updateBranch: (branchId, updates) => set((state) => {
    const newBranchesByCompany = { ...state.branchesByCompany };
    
    // Buscar en qué compañía está la sucursal
    Object.keys(newBranchesByCompany).forEach((companyId) => {
      const companyIdNum = Number(companyId);
      newBranchesByCompany[companyIdNum] = newBranchesByCompany[companyIdNum].map((branch) =>
        branch.id === branchId ? { ...branch, ...updates } : branch
      );
    });
    
    return { branchesByCompany: newBranchesByCompany };
  }),
  
  // Setter: Eliminar una sucursal
  removeBranch: (branchId, companyId) => set((state) => ({
    branchesByCompany: {
      ...state.branchesByCompany,
      [companyId]: state.branchesByCompany[companyId].filter(
        (branch) => branch.id !== branchId
      )
    }
  })),
  
  // Setter: Limpiar todas las sucursales
  clearAllBranches: () => set({ branchesByCompany: {} }),
  
  // Helper: Obtener sucursales de una compañía
  getBranchesForCompany: (companyId) => {
    return get().branchesByCompany[companyId] || [];
  },
  
  // Helper: Verificar si ya se cargaron las sucursales de una compañía
  hasBranchesForCompany: (companyId) => {
    return companyId in get().branchesByCompany;
  }
}));
// #end-store
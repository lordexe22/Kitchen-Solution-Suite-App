/* src/store/Companies.store.ts */
// #section imports
import { create } from 'zustand';
import type { Company } from './Companies.types';
// #end-section

// #interface CompaniesStore
/**
 * Store de Companies usando Zustand.
 * Solo maneja estado, NO hace fetching (eso lo hace el service).
 */
interface CompaniesStore {
  // Estado
  companies: Company[];
  
  // Setters
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: number, updates: Partial<Company>) => void;
  removeCompany: (id: number) => void;
  clearCompanies: () => void;
}
// #end-interface

// #store useCompaniesStore
/**
 * Hook del store de Companies.
 * 
 * @example
 * const { companies, setCompanies, addCompany } = useCompaniesStore();
 */
export const useCompaniesStore = create<CompaniesStore>((set) => ({
  // Estado inicial
  companies: [],
  
  // Setter: Reemplazar toda la lista
  setCompanies: (companies) => set({ companies }),
  
  // Setter: Agregar una compañía
  addCompany: (company) => set((state) => ({
    companies: [...state.companies, company]
  })),
  
  // Setter: Actualizar una compañía
  updateCompany: (id, updates) => set((state) => ({
    companies: state.companies.map((company) =>
      company.id === id ? { ...company, ...updates } : company
    )
  })),
  
  // Setter: Eliminar una compañía
  removeCompany: (id) => set((state) => ({
    companies: state.companies.filter((company) => company.id !== id)
  })),
  
  // Setter: Limpiar todas las compañías
  clearCompanies: () => set({ companies: [] })
}));
// #end-store
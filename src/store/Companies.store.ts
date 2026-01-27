/* src/store/Companies.store.ts */
import { create } from 'zustand';
import type { Company } from '../types/companies.types';

/**
 * Store de Companies usando Zustand.
 * Solo maneja estado, NO hace fetching (eso lo hace el service).
 */

export interface CompaniesStore {
  companies: Company[];
  isHydrated: boolean;
  setCompanies: (companies: Company[]) => void;
  hydrateCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: number, updates: Partial<Company>) => void;
  removeCompany: (id: number) => void;
  clearCompanies: () => void;
}

/**
 * Hook del store de Companies.
 * 
 * @example
 * const { companies, setCompanies, addCompany } = useCompaniesStore();
 */

export const useCompaniesStore = create<CompaniesStore>((set) => ({
  companies: [],
  isHydrated: false,
  setCompanies: (companies) => set({ companies }),
  hydrateCompanies: (companies) => set({ companies, isHydrated: true }),
  addCompany: (company) => set((state) => ({
    companies: [...state.companies, company]
  })),
  updateCompany: (id, updates) => set((state) => ({
    companies: state.companies.map((company) =>
      company.id === id ? { ...company, ...updates } : company
    )
  })),
  removeCompany: (id) => set((state) => ({
    companies: state.companies.filter((company) => company.id !== id)
  })),
  clearCompanies: () => set({ companies: [], isHydrated: false })
}));

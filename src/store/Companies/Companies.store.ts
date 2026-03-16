/* src/store/Companies/Companies.store.ts */
import { create } from 'zustand';
import type { Company } from '../../types/companies.types';
import type { CompaniesStore } from './Companies.types';

// #store useCompaniesStore - store global para gestionar el estado de compañías
/**
 * @description Hook del store de Companies.
 * @purpose Centralizar el estado de compañías y proveer acciones para su manipulación sincrónica.
 * @context Usado en hooks y componentes del dashboard. El fetching lo realizan los services, no este store.
 * @since 1.0.0
 * @author Walter Ezequiel Puig
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
// #end-store

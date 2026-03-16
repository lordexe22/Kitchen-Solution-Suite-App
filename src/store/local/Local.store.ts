// #info - Store para gestionar locales
// #section Imports
import { create } from 'zustand';
import type { LocalStore, Local } from './Local.types.js';
// #end-section

// #section Store Definition
/**
 * Store para gestionar locales.
 * Maneja el estado de los locales y permite operaciones básicas.
 * 
 * @version 1.0.0
 */
export const useLocalStore = create<LocalStore>((set) => ({
  // #section State
  locals: [],
  isHydrated: false,
  // #end-section

  // #section Actions

  /**
   * Establece la lista de locales.
   * @param locals - Lista de locales a establecer.
   */
  setLocals: (locals: Local[]) => set({ locals }),

  /**
   * Hidrata el estado de locales.
   * @param locals - Lista de locales a hidratar.
   */
  hydrateLocals: (locals: Local[]) => set({ locals, isHydrated: true }),

  /**
   * Agrega un nuevo local.
   * @param local - Local a agregar.
   */
  addLocal: (local: Local) => set((state: LocalStore) => ({
    locals: [...state.locals, local],
  })),

  /**
   * Actualiza un local existente.
   * @param id - ID del local a actualizar.
   * @param updates - Campos a actualizar.
   */
  updateLocal: (id: number, updates: Partial<Local>) => set((state: LocalStore) => ({
    locals: state.locals.map((local: Local) =>
      local.id === id ? { ...local, ...updates } : local
    ),
  })),

  /**
   * Elimina un local por su ID.
   * @param id - ID del local a eliminar.
   */
  removeLocal: (id: number) => set((state: LocalStore) => ({
    locals: state.locals.filter((local: Local) => local.id !== id),
  })),

  /**
   * Limpia la lista de locales.
   */
  clearLocals: () => set({ locals: [] }),

  // #end-section
}));
// #end-section
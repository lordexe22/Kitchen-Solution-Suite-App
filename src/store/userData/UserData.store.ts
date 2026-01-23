// src/store/UserData.store.ts
// #section imports
import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';
import { validateAndNormalizeEditableFields, validateAndNormalizeUser } from './UserData.types';
// #end-section
// #store UserDataStore
export const useUserDataStore = create<UserDataStore>()((set) => ({
  user: null,
  isHydrated: false,

  // Actualiza solo campos editables (cliente) - solo disponible después de hidratación
  update: (partial) => set((state) => {
    if (!state.isHydrated) {
      console.warn('[UserDataStore] update rejected: store not hydrated yet');
      return state;
    }
    const result = validateAndNormalizeEditableFields(partial, state.user);
    if (!result.ok) {
      console.warn('[UserDataStore] update rejected:', result.reason);
      return state;
    }
    return { user: result.value };
  }),

  // Reemplaza el usuario completo con datos del servidor y marca como hidratado
  getUserDataFromServer: (user) => {
    if (user === null) {
      set({ user: null, isHydrated: true });
      return;
    }
    const result = validateAndNormalizeUser(user);
    if (!result.ok) {
      console.warn('[UserDataStore] server user rejected:', result.reason);
      return;
    }
    set({ user: result.value, isHydrated: true });
  },

  logout: () => set({ user: null }),
}));
// #end-store

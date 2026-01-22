// src/store/UserData.store.ts
import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';

export const useUserDataStore = create<UserDataStore>()((set) => ({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  imageUrl: null,
  type: null,
  belongToBranchId: null,
  belongToCompanyId: null,
  state: null,
  isAuthenticated: false,

  // Actualiza múltiples campos en una sola operación, reduciendo renders
  update: (partial) => set(partial),

  // Aplica datos de usuario devueltos por el servidor
  getUserDataFromServer: (user) => set({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl ?? null,
    type: user.type,
    belongToBranchId: user.belongToBranchId ?? null,
    belongToCompanyId: user.belongToCompanyId ?? null,
    state: user.state,
    isAuthenticated: true,
  }),

  reset: () => set({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: null,
    state: null,
    type: null,
    belongToBranchId: null,
    belongToCompanyId: null,
    isAuthenticated: false,
  })
}));

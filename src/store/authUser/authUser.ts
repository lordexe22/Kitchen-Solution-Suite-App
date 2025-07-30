/* src\store\authUser\authUser.ts */
// #section Imports
import { type AuthStoreType } from "./type";
import { create } from "zustand";
// #end-section

// #function - Store Zustand para usuario autenticado
export const useAuthStore = create<AuthStoreType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
// #end-function

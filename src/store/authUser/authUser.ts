/* src\store\authUser\authUser.ts */

import { type AuthStoreType } from "./type";

// #function - Store Zustand para usuario autenticado
import { create } from "zustand";

export const useAuthStore = create<AuthStoreType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
// #end-function

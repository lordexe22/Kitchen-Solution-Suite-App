import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';

export const useUserDataStore = create<UserDataStore | null>()((set) => ({
  name: null,
  lastName: null,
  email: null,
  pictureUrl: null,
  type: null,
  state: null,
  isAuthenticated: false,

  setName: (name) => set({ name }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setPictureUrl: (url) => set({ pictureUrl: url }),
  setType: (type) => set({ type }),
  setState: (state) => set({ state }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  reset: () => set({
    name: null,
    lastName: null,
    email: null,
    pictureUrl: null,
    state: null,
    type: null,
  })

}))
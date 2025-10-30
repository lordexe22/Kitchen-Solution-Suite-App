import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';

export const useUserDataStore = create<UserDataStore | null>()((set) => ({
  name: null,
  lastName: null,
  email: null,
  imageUrl: null,
  type: null,
  state: null,
  isAuthenticated: false,

  setName: (name) => set({ name }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setimageUrl: (url) => set({ imageUrl: url }),
  setType: (type) => set({ type }),
  setState: (state) => set({ state }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  reset: () => set({
    name: null,
    lastName: null,
    email: null,
    imageUrl: null,
    state: null,
    type: null,
  })

}))
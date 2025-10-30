import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';

export const useUserDataStore = create<UserDataStore>()((set) => ({
  firstName: null,
  lastName: null,
  email: null,
  imageUrl: null,
  type: null,
  state: null,
  isAuthenticated: false,

  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setType: (type) => set({ type }),
  setState: (state) => set({ state }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  reset: () => set({
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: null,
    state: null,
    type: null,
    isAuthenticated: false,
  })

}))
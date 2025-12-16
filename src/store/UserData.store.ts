import { create } from 'zustand';
import type { UserDataStore } from './UserData.types';

export const useUserDataStore = create<UserDataStore>()((set) => ({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  imageUrl: null,
  type: null,
  branchId: null,
  companyId: null,
  permissions: null,
  state: null,
  isAuthenticated: false,

  setId: (id) => set({ id }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setType: (type) => set({ type }),
  setBranchId: (branchId) => set({ branchId }),
  setCompanyId: (companyId) => set({ companyId }),
  setPermissions: (permissions) => set({ permissions }),
  setState: (state) => set({ state }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  reset: () => set({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: null,
    state: null,
    type: null,
    branchId: null,
    companyId: null,
    permissions: null,
    isAuthenticated: false,
  })

}))
// src/store/UserData.types.ts
export type UserType = 'admin' | 'employee' | 'guest' | 'dev' | null;
export type UserState = 'pending' | 'active' | 'suspended' | null;

export type UserDataStore = {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  type: UserType;
  branchId: number | null;
  branchName: string | null;
  companyId: number | null;
  companyName: string | null;
  companyLogoUrl: string | null;
  permissions: any | null;
  state: UserState;
  isAuthenticated: boolean;

  setId: (id: number) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setImageUrl: (url: string | null) => void;
  setType: (type: UserType) => void;
  setBranchId: (branchId: number | null) => void;
  setBranchName: (branchName: string | null) => void;
  setCompanyId: (companyId: number | null) => void;
  setCompanyName: (companyName: string | null) => void;
  setCompanyLogoUrl: (companyLogoUrl: string | null) => void;
  setPermissions: (permissions: any | null) => void;
  setState: (state: UserState) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
};

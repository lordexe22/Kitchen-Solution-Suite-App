import type { EmployeePermissions } from '../config/permissions.config';

export type UserType = 'admin' | 'employee' | 'guest' | 'dev' | null;
export type UserState = 'pending' | 'active' | 'suspended' | null;

// #type UserDataStore
export interface UserDataStore {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  type: string | null;
  id: number | null;
  state: string | null;
  isAuthenticated: boolean;
  branchId: number | null;
  companyId: number | null;
  permissions: EmployeePermissions | null;

  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setEmail: (email: string | null) => void;
  setImageUrl: (url: string | null) => void;
  setType: (type: string | null) => void;
  setId: (id: number | null) => void;
  setState: (state: string | null) => void;
  setBranchId: (branchId: number | null) => void;
  setCompanyId: (companyId: number | null) => void;
  setPermissions: (permissions: EmployeePermissions | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  reset: () => void;
}
// #end-type

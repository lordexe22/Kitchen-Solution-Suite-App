// src/store/UserData.types.ts
export type UserType = 'admin' | 'employee' | 'guest' | 'ownership' | null;
export type UserState = 'pending' | 'active' | 'suspended' | null;

export type UserDataStore = {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  type: UserType;
  belongToBranchId: number | null;
  belongToCompanyId: number | null;
  state: UserState;
  isAuthenticated: boolean;

  /** Actualiza múltiples campos en una sola operación */
  update: (partial: Partial<{
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageUrl: string | null;
    type: UserType;
    belongToBranchId: number | null;
    belongToCompanyId: number | null;
    state: UserState;
    isAuthenticated: boolean;
  }>) => void;
  /** Obtiene y aplica datos del usuario provenientes del servidor */
  getUserDataFromServer: (user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    type: 'admin' | 'employee' | 'guest' | 'ownership';
    belongToBranchId: number | null;
    belongToCompanyId: number | null;
    state: 'pending' | 'active' | 'suspended';
  }) => void;
  reset: () => void;
};

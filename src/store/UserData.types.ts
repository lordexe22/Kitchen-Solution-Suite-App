
export type UserType = 'admin' | 'employee' | 'guest' | 'dev' | null;
export type UserState = 'pending' | 'active' | 'suspended' | null;

// #type UserDataStore
export interface UserDataStore {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;  // ← Debe ser string | null
  type: string | null;
  state: string | null;
  isAuthenticated: boolean;

  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setEmail: (email: string | null) => void;
  setImageUrl: (url: string | null) => void;  // ← Debe aceptar string | null
  setType: (type: string | null) => void;
  setState: (state: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  reset: () => void;
}
// #end-type

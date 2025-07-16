/* src\store\authUser\type.ts */

// #typedef - Estado global de autenticación
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthStoreType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}
// #end-typedef
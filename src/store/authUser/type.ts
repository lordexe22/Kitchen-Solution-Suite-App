/* src\store\authUser\type.ts */
// #typedef AuthUser
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
// #end-typedef
// #typedef AuthStoreType
export interface AuthStoreType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}
// #end-typedef

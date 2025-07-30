/* src\store\authUser\type.ts */
// #type AuthUser
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}
// #end-type
// #type AuthStoreType
export interface AuthStoreType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}
// #end-type

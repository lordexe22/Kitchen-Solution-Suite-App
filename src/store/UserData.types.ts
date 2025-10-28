
export type UserType = 'admin' | 'employee' | 'guest' | 'dev' | null;
export type UserState = 'pending' | 'active' | 'suspended' | null;

// #type UserDataStore
export interface UserDataStore {
  email: string | null;
  name: string | null;
  lastName: string | null;
  pictureUrl?: string | null;
  type: UserType;
  state: UserState;
  isAuthenticated: boolean;

  setName: (name: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setPictureUrl: (url: string) => void;
  setType: (type: UserType) => void;
  setState: (state: UserState) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  reset: () => void;
};
// #end-type

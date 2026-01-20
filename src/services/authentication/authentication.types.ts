// src/services/authentication/authentication.types.ts
export type PlatformName = 'local' | 'google';

export type RegisterUserData = {
  platformName: PlatformName;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  platformToken?: string | null;
  imageUrl?: string | null;
  credential?: string; // Para Google: token JWT completo
};

export type UserLoginData = {
  email?: string;
  password?: string;
  platformName: PlatformName;
  credential?: string;  // Para Google: token JWT completo
};

export type UserResponse = {
  success: boolean;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    type: 'admin' | 'employee' | 'guest' | 'dev';
    branchId: number | null;
    branchName: string | null;
    companyId: number | null;
    companyName: string | null;
    companyLogoUrl: string | null;
    permissions: any | null;
    state: 'pending' | 'active' | 'suspended';
  };
};

/* src\pages\LoginPage\LoginPage.t.ts */
// #typedef LoginFormDataType 
export interface LoginFormDataType {
  email: string;
  password: string;
}
// #end-typedef
// #typedef AuthResponseType 
export interface AuthResponseType {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
// #end-typedef
/* src\pages\RegisterPage\RegisterPage.t.ts */
// #typedef - Structure of the user data coming from the registration form
/**
 * Represents the raw data collected from the user registration form.
 * Typically used as input before transformation or validation.
 */
export interface RegisterFormDataType {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  acceptedTerms: boolean;
}
// #end-typedef
// #typedef - Structure of the user data ready to be saved in the system
/**
 * Represents the formatted user data ready to be stored in the database.
 * This structure is the result of mapping from the form data.
 */
export interface FormattedUserToSaveType {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  registerDate: string;
  role: 'admin';
  accountStatus: 'free';
}
// #end-typedef
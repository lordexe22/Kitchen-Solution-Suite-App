/* src\pages\RegisterPage\RegisterPage.t.ts */
// #type - Structure of the user data coming from the registration form
/**
 * Represents the raw data collected from the user registration form.
 * Typically used as input before transformation or validation.
 */
export interface RegisterFormDataType {
  name: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}
// #end-type
// #type - Structure of the user data ready to be saved in the system
/**
 * Represents the formatted user data ready to be stored in the database.
 * This structure is the result of mapping from the form data.
 */
export interface FormattedUserToSaveType {
  name: string;
  email: string;
  password: string;
  registerDate: string;
  role: "admin" | "employ" | "dev" | "visitor";
  accountStatus: "active" | "inactive";
}
// #end-type
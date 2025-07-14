/* src\pages\RegisterPage\RegisterPage.util.ts */
import { type FormattedUserToSaveType, type RegisterFormDataType } from "./RegisterPage.t";
// #function registerFormRunner - Handles the registration form submission logic
/**
 * Handles the logic for submitting the registration form.
 * Extracts and validates form data, formats it, and sends it to the backend.
 *
 * @param e - React form submit event
 * @param setError - Callback to set error state
 * @param setSuccessMessage - Callback to set success message state
 */
export const registerFormRunner = async (
  form: HTMLFormElement,
  setError: (msg: string | null) => void,
  setSuccessMessage: (msg: string | null) => void
): Promise<void> => {
  setError(null);
  setSuccessMessage(null);

  // #variable - form, formData, name, email, password, confirmPassword, phone, acceptedTerms
  const formData = new FormData(form);
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const acceptedTerms = formData.get("terms") === "on";
  // #end-variable
  // #step 1 - validate that password and confirmPassword matc
  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden.");
    return;
  }
  // #end-step
  try {
    // #step 2 - create newUser object for send to the server
    const newUser = prepareUserForSaving({
      name,
      email,
      password,
      phone,
      acceptedTerms,
    });
    // #end-step
    // #step 3 - send request to server
    const response = await fetch("http://localhost:4000/api/usuarios/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    // #end-step
    // #step 4 - check server response and throw exception if it return error
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || "Error al registrar el usuario.");
    }
    // #end-step
    // #step 5 - handle successful response by showing message and resetting form
    const data = await response.json();
    setSuccessMessage(`✅ ${data.mensaje}`);
    form.reset();
    // #end-step
  } catch (err: unknown) {
    // #step 6 - handle exceptions showing error messages
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ocurrió un error inesperado.");
    }
    // #end-step
  }
};
// #end-function
// #function prepareUserForSaving  - Prepares the new user data to be sent to the backend
/**
 * Maps and transforms the raw form data into a formatted object 
 * ready to be saved in the database. It ensures correct casing,
 * trims strings, adds registration date, and assigns default roles/status.
 * 
 * @param data - Raw form input from the registration form
 * @returns A formatted user object ready for persistence
 * @throws Error if the terms and conditions are not accepted
 */
export const prepareUserForSaving  = (data: RegisterFormDataType): FormattedUserToSaveType => {

  if (!data.acceptedTerms) {
    throw new Error("Debe aceptar los términos y condiciones");
  }

  // #section return: FormattedUserToSaveType
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password,
    phone: data.phone?.trim(),
    companyName: data.companyName?.trim(),
    registerDate: new Date().toISOString(),
    role: 'admin',
    accountStatus: 'free',
  };
  // #end-section
}
// #end-function
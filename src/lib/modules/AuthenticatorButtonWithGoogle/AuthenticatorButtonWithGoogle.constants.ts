/* AuthenticatorButtonWithGoogle.constants.ts */
/* #info - Constants and mappings for the component */
// #const DEFAULT_PROVIDER - Default provider name
export const DEFAULT_PROVIDER = "google" as const;
// #end-const
// #const ERROR_CODES - Error codes for different scenarios
export const ERROR_CODES = {
  MISSING_CREDENTIAL: "MISSING_CREDENTIAL",
  DECODE_ERROR: "DECODE_ERROR",
  GOOGLE_LOGIN_FAILED: "GOOGLE_LOGIN_FAILED",
  INVALID_TOKEN: "INVALID_TOKEN",
} as const;
// #end-const
// #const ERROR_MESSAGES - Error messages for different scenarios
export const ERROR_MESSAGES = {
  MISSING_CREDENTIAL: "Google login failed: credential is missing",
  DECODE_ERROR: "Error decoding Google token",
  GOOGLE_LOGIN_FAILED: "Google login failed",
  INVALID_TOKEN: "Token inválido: no contiene payload",
} as const;
// #end-const

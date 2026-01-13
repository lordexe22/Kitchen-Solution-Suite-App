/* AuthenticatorButtonWithGoogle.config.ts */
/* #info - Configuration values for AuthenticatorButtonWithGoogle component */
// #variable googleClientId - Google OAuth Client ID from environment variables
/** Google OAuth Client ID from environment variables */
export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// #end-variable
// #variable defaultProps - Default values for component props
/** Default values for component props */
export const defaultProps = {
  size: "medium" as const,
  shape: "rectangular" as const,
  logo_alignment: "left" as const,

};
// #end-variable
// #variable googleButtonConfig - Fixed configuration for Google button behavior
/** Fixed configuration for Google button behavior */
export const googleButtonConfig = {
  ux_mode: "popup" as const,
  type: "standard" as const,
  theme: "outline" as const,
};
// #end-variable

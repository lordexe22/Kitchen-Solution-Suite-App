// AuthenticatorButtonWithGoogle.types.ts
/* #info - This file define the types and interfaces for the component */
// #interface GoogleUserRaw - Raw user data obtained from decoded Google token
export interface GoogleUserRaw {
  iss: string;              // Issuer (Google)
  nbf: number;              // Not before
  aud: string;              // app client ID
  azp: string;              // Authorized party (client ID) 
  sub: string;              // Google user ID
  email: string;            // User email
  email_verified: boolean;  // Is email verified
  name: string;             // Full name
  picture: string;          // Profile picture URL
  given_name: string;       // Given name
  family_name: string;      // Family name
  iat: number;              // Issued at
  exp: number;              // Expiration time
  jti: string;              // JWT ID
}
// #end-interface
// #interface AuthSuccessResponse - Complete authentication response
export interface AuthSuccessResponse {
  // #v-field email - email address
  /** User email address */
  email: string;
  // #end-v-field
  // #v-field emailVerified - Whether email is verified in Google account
  /** Whether email is verified in Google account */
  emailVerified: boolean;
  // #end-v-field
  // #v-field firstName - User's first name
  /** User's first name */
  firstName: string;
  // #end-v-field
  // #v-field lastName - User's last name
  /** User's last name */
  lastName: string;
  // #end-v-field
  // #v-field profilePicture - URL to user's profile picture
  /** URL to user's profile picture */
  profilePicture: string;
  // #end-v-field
  // #v-field googleId - Unique Google user ID
  /** Unique Google user ID */
  googleId: string;
  // #end-v-field
  // #v-field credential - ID token (JWT) for backend validation
  /** ID token (JWT) for backend validation - send this to your server */
  credential: string;
  // #end-v-field
  // #v-field provider - Authentication provider
  /** Authentication provider (always 'google') */
  provider: "google";
  // #end-v-field
}
// #end-interface
// #interface ErrorData - Structured error data
export interface ErrorData {
  // #v-field message - Error message
  /** Error message describing what went wrong */
  message: string;
  // #end-v-field
  // #v-field code - Error code identifier
  code: string;
  // #end-v-field
  // #v-field timestamp - ISO timestamp of when the error occurred
  /** ISO timestamp of when the error occurred */
  timestamp: string;
  // #end-v-field
}
// #end-interface
// #interface AuthenticatorButtonWithGoogleProps - Props for AuthenticatorButtonWithGoogle component
export interface AuthenticatorButtonWithGoogleProps {
  // #f-field onSuccess - Callback for successful authentication
  /** Callback that receives the authentication data on success */
  onSuccess: (data: AuthSuccessResponse) => void;
  // #end-f-field
  // #f-field onError - Callback for authentication errors
  /** Callback that receives error data on failure */
  onError: (error: ErrorData) => void;
  // #end-f-field
  // #v-field size - Size of the button
  /** Size of the button */
  size?: "large" | "medium" | "small";
  // #end-v-field
  // #v-field shape - Shape of the button
  /** Shape of the button */
  shape?: "rectangular" | "pill" | "circle" | "square";
  // #end-v-field
  // #v-field logo_alignment - Alignment of the Google logo
  /** Alignment of the Google logo */
  logo_alignment?: "left" | "center";
  // #end-v-field
  // #v-field width - Width of the button in pixels
  /** Width of the button in pixels */
  width?: string;
  // #end-v-field
  // #v-field type - Button type
  /** Button type: standard (with text) or icon (icon only) */
  type?: "standard" | "icon";
  // #end-v-field
  // #v-field theme - Button theme
  /** Button theme */
  theme?: "outline" | "filled_blue" | "filled_black";
  // #end-v-field
  // #v-field ux_mode - UX mode (popup or redirect)
  /** UX mode: popup or redirect */
  ux_mode?: "popup" | "redirect";
  // #end-v-field
  // #v-field className - Additional CSS class for the container
  /** Additional CSS class for the container */
  className?: string;
  // #end-v-field
}
// #end-interface

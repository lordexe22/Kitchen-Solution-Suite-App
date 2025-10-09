// authenticatorWithGoogle.tsx
// #section Imports
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleConfig } from "./authenticatorWithGoogle.config";
import type { AuthenticatorWithGoogleProps } from "./authenticatorWithGoogle.types";
import { handleGoogleSuccess, handleGoogleError } from "./authenticatorWithGoogle.utils";
// #end-section

// #component AuthenticatorWithGoogle
const AuthenticatorWithGoogle = (
  {
    onAuth,
    mode = 'login'
  }: AuthenticatorWithGoogleProps
) => {

  return (
    <GoogleOAuthProvider clientId={googleConfig.clientId}>
      <GoogleLogin
        onSuccess={(response) => handleGoogleSuccess(response, onAuth)}
        onError={() => handleGoogleError(onAuth)}
        text={mode === "login" ? "signin_with" : "signup_with"}
        useOneTap={true}
        type="standard"
        theme="outline"
      />
    </GoogleOAuthProvider>
  );
}
export default AuthenticatorWithGoogle;
// #end-component
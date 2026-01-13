// AuthenticatorButtonWithGoogle.tsx
/* #info - Google OAuth authentication button component with full customization */
// #section Imports
import { GoogleLogin } from "@react-oauth/google";
import { defaultProps, googleButtonConfig } from "./AuthenticatorButtonWithGoogle.config";
import { handleGoogleSuccess, handleGoogleError, validateWidth } from "./AuthenticatorButtonWithGoogle.utils";
import type { AuthenticatorButtonWithGoogleProps } from "./AuthenticatorButtonWithGoogle.types";
import styles from "./AuthenticatorButtonWithGoogle.module.css";
// #end-section
// #component AuthenticatorButtonWithGoogle
const AuthenticatorButtonWithGoogle = ({
  onSuccess,
  onError,  
  size = defaultProps.size,
  shape = defaultProps.shape,
  logo_alignment = defaultProps.logo_alignment,
  width,
  type = googleButtonConfig.type,
  theme = googleButtonConfig.theme,
  ux_mode = googleButtonConfig.ux_mode,
  className,
}: AuthenticatorButtonWithGoogleProps) => {
  // #step 1 - Validate width prop if provided
  if (width && !validateWidth(width)) {
    console.warn(`Invalid width value: ${width}. Using auto width.`);
  }
  // #end-step
  // #step 2 - Render login button
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <GoogleLogin
        onSuccess={(response) => handleGoogleSuccess(response, onSuccess, onError)}
        onError={() => handleGoogleError(onError)}
        size={size}
        shape={shape}
        logo_alignment={logo_alignment}
        width={width}
        type={type}
        theme={theme}
        ux_mode={ux_mode}
      />
    </div>
  );
  // #end-step
};
export default AuthenticatorButtonWithGoogle;
// #end-component

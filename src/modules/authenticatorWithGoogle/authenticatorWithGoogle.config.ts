// authenticatorWithGoogle.config.ts
import type { GoogleConfig } from "./authenticatorWithGoogle.types";

export const googleConfig: GoogleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

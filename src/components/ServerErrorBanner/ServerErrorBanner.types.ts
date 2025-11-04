// #interface ServerErrorBannerProps
export interface ServerErrorBannerProps {
  message: string | null;
  onClose: () => void;
  autoCloseDelay?: number; // en milisegundos
}
// #end-interface
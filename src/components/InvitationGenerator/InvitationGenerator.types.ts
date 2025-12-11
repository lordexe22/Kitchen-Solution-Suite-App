/* src/components/InvitationGenerator/InvitationGenerator.types.ts */

// #type InvitationGeneratorProps
/**
 * Props del componente InvitationGenerator.
 */
export interface InvitationGeneratorProps {
  /** Callback cuando se genera una invitación exitosamente */
  onInvitationGenerated?: (invitationUrl: string) => void;
}
// #end-type

// #type InvitationResponse
/**
 * Respuesta del backend al crear una invitación.
 */
export interface InvitationResponse {
  id: number;
  token: string;
  branchId: number;
  companyId: number;
  expiresAt: string;
  createdAt: string;
  invitationUrl: string;
}
// #end-type

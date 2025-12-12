// src/services/invitations/invitations.types.ts

// #interface InvitationValidationPayload
export interface InvitationValidationPayload {
  valid: boolean;
  companyName?: string;
  branchName?: string;
  expiresAt?: string;
  expiresIn?: {
    days: number;
    hours: number;
    minutes: number;
  };
  message?: string;
  error?: string;
}
// #end-interface

// #interface InvitationResponse
export interface InvitationResponse {
  id: number;
  token: string;
  branchId: number;
  companyId: number;
  expiresAt: string;
  createdAt: string;
  invitationUrl: string;
}
// #end-interface

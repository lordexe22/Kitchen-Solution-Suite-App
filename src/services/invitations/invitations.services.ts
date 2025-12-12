// src/services/invitations/invitations.services.ts

import { httpClient } from '../../api/httpClient.instance';
import type { InvitationResponse, InvitationValidationPayload } from './invitations.types';

// #section API Types
/**
 * DTO para crear una invitación
 */
interface CreateInvitationDTO {
  branchId: number;
  companyId: number;
}

/**
 * Respuesta de la API al listar invitaciones
 */
interface InvitationListItem {
  id: number;
  token: string;
  branchId: number;
  companyId: number;
  expiresAt: string;
  createdAt: string;
  invitationUrl: string;
  isActive: boolean;
  usedAt: string | null;
}
// #end-section

// #function createInvitation - genera un nuevo enlace de invitación para empleado
/**
 * Crea una nueva invitación para un empleado en una sucursal específica
 * 
 * @param payload - Datos de la invitación (branchId, companyId)
 * @returns Promise con la respuesta de la invitación generada
 * @throws Error si la petición falla o el usuario no tiene permisos
 */
export const createInvitation = async (
  payload: CreateInvitationDTO
): Promise<InvitationResponse> => {
  const response = await httpClient.post<InvitationResponse>('/invitations', payload);
  return response;
};
// #end-function

// #function getInvitationsByCompany - obtiene todas las invitaciones de una compañía
/**
 * Lista todas las invitaciones generadas para una compañía específica
 * Requiere que el usuario sea ownership de la compañía
 * 
 * @param companyId - ID de la compañía
 * @returns Promise con array de invitaciones
 * @throws Error si la petición falla o el usuario no tiene permisos
 */
export const getInvitationsByCompany = async (
  companyId: number
): Promise<InvitationListItem[]> => {
  const response = await httpClient.get<InvitationListItem[]>(
    `/invitations/company/${companyId}`
  );
  return response;
};
// #end-function

// #function validateInvitationToken - valida un token de invitación (público)
/**
 * Valida si un token de invitación es válido y no ha expirado
 * Endpoint público, no requiere autenticación
 * 
 * @param token - Token de invitación a validar
 * @returns Promise con datos de la invitación si es válida
 * @throws Error si el token es inválido, expirado o ya usado
 */
export const validateInvitationToken = async (token: string): Promise<InvitationValidationPayload> => {
  const url = `/invitations/validate?token=${token}`;
  console.log('[invitations.services] GET', url, '| token:', token.substring(0, 8) + '...');

  try {
    const response = await httpClient.get<InvitationValidationPayload>(url);
    console.log('[invitations.services] ✓ respuesta validate', {
      valid: response?.valid,
      companyName: response?.companyName,
      branchName: response?.branchName,
      expiresAt: response?.expiresAt,
      message: response?.message,
      error: response?.error
    });
    return response;
  } catch (error) {
    const status = (error as { status?: number }).status;
    console.error('[invitations.services] ✗ error validate', {
      status,
      message: (error as { message?: string }).message
    });
    throw error;
  }
};
// #end-function

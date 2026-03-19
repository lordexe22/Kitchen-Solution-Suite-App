// src/services/users/userAvatar.service.ts

// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { UserAvatarResponse } from './userAvatar.types';
// #end-section

// #service uploadUserAvatar - Sube o actualiza el avatar del usuario
/**
 * @description Sube o actualiza el avatar del usuario.
 * @purpose Proveer al usuario la capacidad de personalizar su imagen de perfil.
 * @context Utilizado por SettingsModal al confirmar la subida de una nueva imagen de avatar.
 * @param file archivo de imagen a subir
 * @returns datos del usuario actualizados con la nueva URL del avatar
 * @throws Error si el archivo no es una imagen válida o la solicitud al servidor falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const uploadUserAvatar = async (file: File): Promise<UserAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);

  return httpClient.post<UserAvatarResponse>('/users/avatar', formData, {
    withCredentials: true,
    headers: {} // Dejar que el navegador establezca el Content-Type con boundary para FormData
  });
};
// #end-service

// #service deleteUserAvatar - Elimina el avatar del usuario
/**
 * @description Elimina el avatar del usuario.
 * @purpose Permitir al usuario remover su foto de perfil y quedar sin imagen asignada.
 * @context Utilizado por SettingsModal al confirmar la eliminación del avatar actual.
 * @returns datos del usuario actualizados sin avatar
 * @throws Error si el usuario no tiene avatar o la solicitud al servidor falla
 * @since 1.0.0
 * @author Walter Ezequiel Puig
 */
export const deleteUserAvatar = async (): Promise<UserAvatarResponse> => {
  return httpClient.delete<UserAvatarResponse>('/users/avatar');
};
// #end-service
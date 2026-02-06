// src/services/users/userAvatar.service.ts

import { httpClient } from '../../api/httpClient.instance';

// #interface UserAvatarResponse
interface UserAvatarResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
  cloudinary?: {
    publicId: string;
    url: string;
  };
}
// #end-interface

// #function uploadUserAvatar
/**
 * Sube o actualiza el avatar del usuario.
 * 
 * @param file - Archivo de imagen a subir
 * @returns Usuario actualizado con la nueva URL del avatar
 * 
 * @example
 * const file = input.files[0];
 * const updatedUser = await uploadUserAvatar(file);
 */
export const uploadUserAvatar = async (file: File): Promise<UserAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await httpClient.post('http://localhost:4000/api/users/avatar', formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
// #end-function

// #function deleteUserAvatar
/**
 * Elimina el avatar del usuario.
 * 
 * @returns Usuario actualizado sin avatar
 * 
 * @example
 * const updatedUser = await deleteUserAvatar();
 */
export const deleteUserAvatar = async (): Promise<UserAvatarResponse> => {
  const response = await httpClient.delete<UserAvatarResponse>('/users/avatar');
  return response.data;
};
// #end-function
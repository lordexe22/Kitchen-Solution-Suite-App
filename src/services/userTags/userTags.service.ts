/* src/services/userTags/userTags.service.ts */
// #section imports
import { httpClient } from '../../api/httpClient.instance';
import type { TagConfiguration } from '../../modules/tagCreator';
// #end-section

// #interface UserTagDB
/**
 * Representa una etiqueta personalizada desde la base de datos.
 */
interface UserTagDB {
  id: number;
  userId: number;
  tagConfig: string; // JSON stringificado
  createdAt: string;
  updatedAt: string;
}
// #end-interface

// #interface UserTagWithId
/**
 * Etiqueta con su configuración y ID de base de datos.
 */
export interface UserTagWithId extends TagConfiguration {
  id: number;
}
// #end-interface

// #interface CreateUserTagPayload
/**
 * Payload para crear una etiqueta personalizada.
 */
interface CreateUserTagPayload {
  tagConfig: string; // TagConfiguration como JSON string
}
// #end-interface

// #function getUserTags
/**
 * Obtiene todas las etiquetas personalizadas del usuario autenticado.
 * 
 * @returns {Promise<UserTagWithId[]>} Array de etiquetas con ID y configuración
 * 
 * @example
 * const tags = await getUserTags();
 * console.log(tags); // [{ id: 1, name: "Mi Tag", textColor: "#FF0000", ... }]
 */
export const getUserTags = async (): Promise<UserTagWithId[]> => {
  const response = await httpClient.get<{ tags: UserTagDB[] }>(
    '/users/tags'
  );

  // Parsear tagConfig de cada tag y agregar el ID
  return response.tags.map((tag: UserTagDB) => ({
    id: tag.id,
    ...(JSON.parse(tag.tagConfig) as TagConfiguration)
  }));
};
// #end-function

// #function createUserTag
/**
 * Crea una nueva etiqueta personalizada.
 * 
 * @param {TagConfiguration} tagConfig - Configuración de la etiqueta
 * @returns {Promise<UserTagWithId>} Configuración de la etiqueta creada con ID
 * 
 * @example
 * const newTag = await createUserTag({
 *   name: "Mi Etiqueta",
 *   textColor: "#FF0000",
 *   backgroundColor: "#FFE4E4",
 *   icon: "🔥",
 *   hasBorder: true,
 *   size: "medium"
 * });
 */
export const createUserTag = async (
  tagConfig: TagConfiguration
): Promise<UserTagWithId> => {
  const payload: CreateUserTagPayload = {
    tagConfig: JSON.stringify(tagConfig)
  };

  const response = await httpClient.post<{ tag: UserTagDB }>(
    '/users/tags',
    payload
  );

  return {
    id: response.tag.id,
    ...(JSON.parse(response.tag.tagConfig) as TagConfiguration)
  };
};
// #end-function

// #function deleteUserTag
/**
 * Elimina una etiqueta personalizada por su ID.
 * 
 * @param {number} tagId - ID de la etiqueta a eliminar
 * @returns {Promise<void>}
 * 
 * @example
 * await deleteUserTag(5);
 */
export const deleteUserTag = async (tagId: number): Promise<void> => {
  await httpClient.delete(`/users/tags/${tagId}`);
};
// #end-function
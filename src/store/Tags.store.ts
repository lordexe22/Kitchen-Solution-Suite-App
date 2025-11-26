/* src/store/Tags.store.ts */
// #section imports
import { create } from 'zustand';
import type { TagConfiguration } from '../modules/tagCreator';
import { SYSTEM_TAGS } from './Tags.config';
import { getUserTags, createUserTag, deleteUserTag } from '../services/userTags/userTags.service';
import type { UserTagWithId } from '../services/userTags/userTags.service';
// #end-section

// #interface TagsStore
/**
 * Store de Tags usando Zustand.
 * Gestiona dos tipos de tags:
 * - System Tags: Predeterminados, siempre disponibles, inmutables
 * - User Tags: Creados por el usuario, se pueden modificar/eliminar, sincronizados con DB
 */
interface TagsStore {
  // Estado
  systemTags: TagConfiguration[];
  userTags: UserTagWithId[];
  isLoaded: boolean;
  isLoading: boolean;
  
  // Getters
  getAllTags: () => TagConfiguration[];
  getUserTagByName: (name: string) => UserTagWithId | undefined;
  hasUserTag: (name: string) => boolean;
  isSystemTag: (name: string) => boolean;
  
  // Setters (sincronizados con DB)
  loadUserTags: () => Promise<void>;
  addUserTag: (tag: TagConfiguration) => Promise<void>;
  removeUserTag: (tagId: number, tagName: string) => Promise<void>;
  clearUserTags: () => void;
}
// #end-interface

// #function useTagsStore
/**
 * Hook del store de Tags.
 * 
 * @example
 * const { systemTags, userTags, addUserTag, loadUserTags } = useTagsStore();
 */
export const useTagsStore = create<TagsStore>((set, get) => ({
  // Estado inicial
  systemTags: SYSTEM_TAGS,
  userTags: [],
  isLoaded: false,
  isLoading: false,
  
  // Getter: Obtener todos los tags (system + user)
  getAllTags: () => {
    return [...get().systemTags, ...get().userTags];
  },
  
  // Getter: Obtener user tag por nombre
  getUserTagByName: (name) => {
    return get().userTags.find((tag) => tag.name === name);
  },
  
  // Getter: Verificar si existe un user tag
  hasUserTag: (name) => {
    return get().userTags.some((tag) => tag.name === name);
  },
  
  // Getter: Verificar si es un system tag
  isSystemTag: (name) => {
    return get().systemTags.some((tag) => tag.name === name);
  },
  
  // Setter: Cargar etiquetas desde DB
  loadUserTags: async () => {
    const state = get();
    
    // Si ya están cargadas o cargando, no hacer nada
    if (state.isLoaded || state.isLoading) {
      return;
    }
    
    set({ isLoading: true });
    
    try {
      const tagsFromDB = await getUserTags();
      
      set({ 
        userTags: tagsFromDB,
        isLoaded: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error cargando etiquetas del usuario:', error);
      set({ isLoading: false });
    }
  },
  
  // Setter: Agregar un user tag (sincronizado con DB)
  addUserTag: async (tag) => {
    const state = get();
    
    // Verificar si el nombre ya existe en system tags
    if (state.systemTags.some((t) => t.name === tag.name)) {
      console.warn(`⚠️ No se puede crear un tag con el nombre "${tag.name}" porque ya existe como tag del sistema`);
      throw new Error(`El nombre "${tag.name}" ya existe como etiqueta del sistema`);
    }
    
    // Verificar si el nombre ya existe en user tags
    if (state.userTags.some((t) => t.name === tag.name)) {
      console.warn(`⚠️ Ya existe un tag personalizado con el nombre "${tag.name}"`);
      throw new Error(`Ya existe una etiqueta con el nombre "${tag.name}"`);
    }
    
    try {
      // Guardar en DB y obtener con ID
      const newTag = await createUserTag(tag);
      
      // Agregar al store local
      set((state) => ({
        userTags: [...state.userTags, newTag]
      }));
    } catch (error) {
      console.error('Error creando etiqueta:', error);
      throw error;
    }
  },
  
  // Setter: Eliminar un user tag por ID (sincronizado con DB)
  removeUserTag: async (tagId, tagName) => {
    const state = get();
    
    // Verificar que no sea un system tag
    if (state.systemTags.some((t) => t.name === tagName)) {
      console.warn(`⚠️ No se puede eliminar "${tagName}" porque es un tag del sistema`);
      throw new Error(`"${tagName}" es una etiqueta del sistema y no se puede eliminar`);
    }
    
    try {
      // Eliminar de DB
      await deleteUserTag(tagId);
      
      // Eliminar del store local
      set((state) => ({
        userTags: state.userTags.filter((tag) => tag.id !== tagId)
      }));
    } catch (error) {
      console.error('Error eliminando etiqueta:', error);
      throw error;
    }
  },
  
  // Setter: Limpiar todos los user tags (solo local)
  clearUserTags: () => set({ userTags: [], isLoaded: false })
}));
// #end-function
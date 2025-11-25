/* src/store/Tags.store.ts */
// #section imports
import { create } from 'zustand';
import type { TagConfiguration } from '../modules/tagCreator';
import { SYSTEM_TAGS } from './Tags.config';
// #end-section

// #interface TagsStore
/**
 * Store de Tags usando Zustand.
 * Gestiona dos tipos de tags:
 * - System Tags: Predeterminados, siempre disponibles, inmutables
 * - User Tags: Creados por el usuario, se pueden modificar/eliminar
 */
interface TagsStore {
  // Estado
  systemTags: TagConfiguration[];
  userTags: TagConfiguration[];
  
  // Getters
  getAllTags: () => TagConfiguration[];
  getUserTagByName: (name: string) => TagConfiguration | undefined;
  hasUserTag: (name: string) => boolean;
  isSystemTag: (name: string) => boolean;
  
  // Setters (solo para userTags)
  addUserTag: (tag: TagConfiguration) => void;
  removeUserTag: (name: string) => void;
  clearUserTags: () => void;
}
// #end-interface

// #store useTagsStore
/**
 * Hook del store de Tags.
 * 
 * @example
 * const { systemTags, userTags, addUserTag } = useTagsStore();
 */
export const useTagsStore = create<TagsStore>((set, get) => ({
  // Estado inicial
  systemTags: SYSTEM_TAGS,
  userTags: [],
  
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
  
  // Setter: Agregar un user tag
  addUserTag: (tag) => set((state) => {
    // Verificar si el nombre ya existe en system tags
    if (state.systemTags.some((t) => t.name === tag.name)) {
      console.warn(`⚠️ No se puede crear un tag con el nombre "${tag.name}" porque ya existe como tag del sistema`);
      return state;
    }
    
    // Verificar si el nombre ya existe en user tags
    if (state.userTags.some((t) => t.name === tag.name)) {
      console.warn(`⚠️ Ya existe un tag personalizado con el nombre "${tag.name}"`);
      return state;
    }
    
    return { userTags: [...state.userTags, tag] };
  }),
  
  // Setter: Eliminar un user tag por nombre
  removeUserTag: (name) => set((state) => {
    // Verificar que no sea un system tag
    if (state.systemTags.some((t) => t.name === name)) {
      console.warn(`⚠️ No se puede eliminar "${name}" porque es un tag del sistema`);
      return state;
    }
    
    return { userTags: state.userTags.filter((tag) => tag.name !== name) };
  }),
  
  // Setter: Limpiar todos los user tags
  clearUserTags: () => set({ userTags: [] })
}));
// #end-store
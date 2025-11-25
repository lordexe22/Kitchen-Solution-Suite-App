/* src/store/Tags.store.ts */
// #section imports
import { create } from 'zustand';
import type { TagConfiguration } from '../modules/tagCreator';
// #end-section

// #interface TagsStore
/**
 * Store de Tags usando Zustand.
 * Almacena configuraciones de etiquetas creadas por el usuario.
 */
interface TagsStore {
  // Estado
  tags: TagConfiguration[];
  
  // Getters
  getTagByName: (name: string) => TagConfiguration | undefined;
  hasTag: (name: string) => boolean;
  
  // Setters
  addTag: (tag: TagConfiguration) => void;
  removeTag: (name: string) => void;
  clearTags: () => void;
}
// #end-interface

// #store useTagsStore
/**
 * Hook del store de Tags.
 * 
 * @example
 * const { tags, addTag, removeTag } = useTagsStore();
 */
export const useTagsStore = create<TagsStore>((set, get) => ({
  // Estado inicial
  tags: [],
  
  // Getter: Obtener tag por nombre
  getTagByName: (name) => {
    return get().tags.find((tag) => tag.name === name);
  },
  
  // Getter: Verificar si existe un tag
  hasTag: (name) => {
    return get().tags.some((tag) => tag.name === name);
  },
  
  // Setter: Agregar un tag
  addTag: (tag) => set((state) => {
    // Evitar duplicados por nombre
    if (state.tags.some((t) => t.name === tag.name)) {
      console.warn(`⚠️ Ya existe un tag con el nombre "${tag.name}"`);
      return state;
    }
    return { tags: [...state.tags, tag] };
  }),
  
  // Setter: Eliminar un tag por nombre
  removeTag: (name) => set((state) => ({
    tags: state.tags.filter((tag) => tag.name !== name)
  })),
  
  // Setter: Limpiar todos los tags
  clearTags: () => set({ tags: [] })
}));
// #end-store
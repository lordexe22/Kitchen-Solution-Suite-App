/* src/store/Categories.store.ts */
// #section imports
import { create } from 'zustand';
import type { Category, CategoryWithParsedGradient } from './Categories.types';
import { parseCategoryGradient } from './Categories.types';
// #end-section

// #interface CategoriesStore
/**
 * Store de Categories usando Zustand.
 * Organizado por branchId para acceso eficiente.
 * Solo maneja estado, NO hace fetching (eso lo hace el service).
 */
interface CategoriesStore {
  // Estado: Map de branchId -> categorías
  categoriesByBranch: Map<number, CategoryWithParsedGradient[]>;
  
  // Getters
  getCategoriesForBranch: (branchId: number) => CategoryWithParsedGradient[];
  hasCategoriesForBranch: (branchId: number) => boolean;
  
  // Setters
  setCategoriesForBranch: (branchId: number, categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  updateMultipleCategories: (updates: Array<{ id: number; updates: Partial<Category> }>) => void;
  removeCategory: (id: number, branchId: number) => void;
  clearCategories: () => void;
  clearCategoriesForBranch: (branchId: number) => void;
}
// #end-interface

// #store useCategoriesStore
/**
 * Hook del store de Categories.
 * 
 * @example
 * const { getCategoriesForBranch, addCategory } = useCategoriesStore();
 */
export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  // Estado inicial
  categoriesByBranch: new Map(),
  
  // Getter: Obtener categorías de una sucursal
  getCategoriesForBranch: (branchId: number) => {
    return get().categoriesByBranch.get(branchId) || [];
  },
  
  // Getter: Verificar si existen categorías de una sucursal en cache
  hasCategoriesForBranch: (branchId: number) => {
    return get().categoriesByBranch.has(branchId);
  },
  
  // Setter: Establecer categorías de una sucursal
  setCategoriesForBranch: (branchId: number, categories: Category[]) => {
    const parsedCategories = categories.map(parseCategoryGradient);
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      newMap.set(branchId, parsedCategories);
      return { categoriesByBranch: newMap };
    });
  },
  
  // Setter: Agregar una categoría
  addCategory: (category: Category) => {
    const parsed = parseCategoryGradient(category);
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      const existing = newMap.get(category.branchId) || [];
      newMap.set(category.branchId, [...existing, parsed]);
      return { categoriesByBranch: newMap };
    });
  },
  
  // Setter: Actualizar una categoría
  updateCategory: (id: number, updates: Partial<Category>) => {
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      
      // Buscar en qué branch está la categoría
      for (const [branchId, categories] of newMap.entries()) {
        const categoryIndex = categories.findIndex(c => c.id === id);
        if (categoryIndex !== -1) {
          const updatedCategories = [...categories];
          const updatedCategory = { ...categories[categoryIndex], ...updates };
          
          // Si se actualizó gradientConfig, re-parsear
          if (updates.gradientConfig !== undefined) {
            updatedCategories[categoryIndex] = parseCategoryGradient(updatedCategory as Category);
          } else {
            updatedCategories[categoryIndex] = updatedCategory;
          }
          
          // 🆕 Si se actualizó sortOrder, reordenar el array
          const shouldReorder = updates.sortOrder !== undefined;
          const finalCategories = shouldReorder
            ? updatedCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            : updatedCategories;
          
          newMap.set(branchId, finalCategories);
          break;
        }
      }
      
      return { categoriesByBranch: newMap };
    });
  },
  
  // 🆕 Setter: Actualizar múltiples categorías de una vez (más eficiente para drag & drop)
  updateMultipleCategories: (updates: Array<{ id: number; updates: Partial<Category> }>) => {
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      
      // Agrupar updates por branchId
      const updatesByBranch = new Map<number, Array<{ id: number; updates: Partial<Category> }>>();
      
      // Buscar branchId de cada categoría
      for (const update of updates) {
        for (const [branchId, categories] of newMap.entries()) {
          if (categories.some(c => c.id === update.id)) {
            if (!updatesByBranch.has(branchId)) {
              updatesByBranch.set(branchId, []);
            }
            updatesByBranch.get(branchId)!.push(update);
            break;
          }
        }
      }
      
      // Aplicar updates por branch
      for (const [branchId, branchUpdates] of updatesByBranch.entries()) {
        const categories = newMap.get(branchId) || [];
        const updatedCategories = categories.map(cat => {
          const update = branchUpdates.find(u => u.id === cat.id);
          if (!update) return cat;
          
          const updated = { ...cat, ...update.updates };
          return update.updates.gradientConfig !== undefined
            ? parseCategoryGradient(updated as Category)
            : updated;
        });
        
        // Reordenar si algún update incluyó sortOrder
        const hasOrderUpdate = branchUpdates.some(u => u.updates.sortOrder !== undefined);
        const finalCategories = hasOrderUpdate
          ? updatedCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          : updatedCategories;
        
        newMap.set(branchId, finalCategories);
      }
      
      return { categoriesByBranch: newMap };
    });
  },
  
  // Setter: Eliminar una categoría
  removeCategory: (id: number, branchId: number) => {
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      const existing = newMap.get(branchId) || [];
      newMap.set(branchId, existing.filter(c => c.id !== id));
      return { categoriesByBranch: newMap };
    });
  },
  
  // Setter: Limpiar todas las categorías
  clearCategories: () => set({ categoriesByBranch: new Map() }),
  
  // Setter: Limpiar categorías de una sucursal específica
  clearCategoriesForBranch: (branchId: number) => {
    set((state) => {
      const newMap = new Map(state.categoriesByBranch);
      newMap.delete(branchId);
      return { categoriesByBranch: newMap };
    });
  }
}));
// #end-store
/* src/store/Products.store.ts */
// #section Imports
import { create } from 'zustand';
import type { Product, ProductWithParsedImages } from './Products.types';
import { parseProductImages } from './Products.types';
// #end-section

// #interface ProductsState
/**
 * Estado del store de productos.
 */
interface ProductsState {
  // Map: categoryId → Product[]
  productsByCategory: Map<number, ProductWithParsedImages[]>;
  
  // Getters
  getProductsByCategory: (categoryId: number) => ProductWithParsedImages[];
  getProductById: (id: number) => ProductWithParsedImages | undefined;
  
  // Setters
  setProducts: (categoryId: number, products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  updateMultipleProducts: (updates: Array<{ id: number; updates: Partial<Product> }>) => void;
  removeProduct: (id: number, categoryId: number) => void;
  clearProducts: () => void;
  clearProductsForCategory: (categoryId: number) => void;
}
// #end-interface

// #store useProductsStore
/**
 * Store de Zustand para gestionar productos.
 * 
 * Organiza productos por categoría para acceso eficiente.
 * Todos los productos se almacenan con imágenes parseadas.
 */
export const useProductsStore = create<ProductsState>((set, get) => ({
  // Estado inicial
  productsByCategory: new Map(),

  // Getter: Obtener productos de una categoría
  getProductsByCategory: (categoryId: number) => {
    return get().productsByCategory.get(categoryId) || [];
  },

  // Getter: Obtener un producto por ID
  getProductById: (id: number) => {
    const allProducts = Array.from(get().productsByCategory.values()).flat();
    return allProducts.find(p => p.id === id);
  },

  // Setter: Establecer todos los productos de una categoría
  setProducts: (categoryId: number, products: Product[]) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      
      // Parsear imágenes y ordenar por sortOrder
      const parsedProducts = products
        .map(parseProductImages)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      newMap.set(categoryId, parsedProducts);
      
      return { productsByCategory: newMap };
    });
  },

  // Setter: Agregar un nuevo producto
  addProduct: (product: Product) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      const categoryId = product.categoryId;
      const existing = newMap.get(categoryId) || [];
      
      // Parsear imágenes
      const parsed = parseProductImages(product);
      
      // Agregar y reordenar
      const updated = [...existing, parsed].sort((a, b) => a.sortOrder - b.sortOrder);
      newMap.set(categoryId, updated);
      
      return { productsByCategory: newMap };
    });
  },

// Setter: Actualizar un producto existente
  updateProduct: (id: number, updates: Partial<Product>) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      
      // Buscar el producto en todas las categorías
      for (const [categoryId, products] of newMap.entries()) {
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
          const updatedProducts = [...products];
          const currentProduct = updatedProducts[index];
          
          // Crear un producto temporal con los updates aplicados
          const tempProduct: Product = {
            ...currentProduct,
            ...updates,
            // Forzar que images sea string | null para Product
            images: updates.images !== undefined ? updates.images : (currentProduct.images as unknown as string | null)
          } as Product;
          
          // Parsear si se actualizaron imágenes
          if (updates.images !== undefined) {
            updatedProducts[index] = parseProductImages(tempProduct);
          } else {
            // Mantener las imágenes parseadas existentes
            updatedProducts[index] = {
              ...currentProduct,
              ...updates,
              images: currentProduct.images, // Ya está parseado
              mainImage: currentProduct.mainImage
            };
          }
          
          // Reordenar si se actualizó sortOrder
          const finalProducts = updates.sortOrder !== undefined
            ? updatedProducts.sort((a, b) => a.sortOrder - b.sortOrder)
            : updatedProducts;
          
          newMap.set(categoryId, finalProducts);
          break;
        }
      }
      
      return { productsByCategory: newMap };
    });
  },

// Setter: Actualizar múltiples productos (para reordenar)
  updateMultipleProducts: (updates: Array<{ id: number; updates: Partial<Product> }>) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      
      // Agrupar updates por categoryId
      const updatesByCategory = new Map<number, Array<{ id: number; updates: Partial<Product> }>>();
      
      // Buscar categoryId de cada producto
      for (const update of updates) {
        for (const [categoryId, products] of newMap.entries()) {
          if (products.some(p => p.id === update.id)) {
            if (!updatesByCategory.has(categoryId)) {
              updatesByCategory.set(categoryId, []);
            }
            updatesByCategory.get(categoryId)!.push(update);
            break;
          }
        }
      }
      
      // Aplicar updates por categoría
      for (const [categoryId, categoryUpdates] of updatesByCategory.entries()) {
        const products = newMap.get(categoryId) || [];
        const updatedProducts = products.map(product => {
          const update = categoryUpdates.find(u => u.id === product.id);
          if (!update) return product;
          
          // Si se actualiza images, necesitamos parsear
          if (update.updates.images !== undefined) {
            const tempProduct: Product = {
              ...product,
              ...update.updates,
              images: update.updates.images as string | null
            } as Product;
            return parseProductImages(tempProduct);
          }
          
          // Si no hay actualización de images, mantener parseadas
          return {
            ...product,
            ...update.updates,
            images: product.images, // Ya está parseado
            mainImage: product.mainImage
          };
        });
        
        // Reordenar si algún update incluyó sortOrder
        const hasOrderUpdate = categoryUpdates.some(u => u.updates.sortOrder !== undefined);
        const finalProducts = hasOrderUpdate
          ? updatedProducts.sort((a, b) => a.sortOrder - b.sortOrder)
          : updatedProducts;
        
        newMap.set(categoryId, finalProducts);
      }
      
      return { productsByCategory: newMap };
    });
  },

  // Setter: Eliminar un producto
  removeProduct: (id: number, categoryId: number) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      const existing = newMap.get(categoryId) || [];
      newMap.set(categoryId, existing.filter(p => p.id !== id));
      return { productsByCategory: newMap };
    });
  },

  // Setter: Limpiar todos los productos
  clearProducts: () => set({ productsByCategory: new Map() }),

  // Setter: Limpiar productos de una categoría específica
  clearProductsForCategory: (categoryId: number) => {
    set((state) => {
      const newMap = new Map(state.productsByCategory);
      newMap.delete(categoryId);
      return { productsByCategory: newMap };
    });
  }
}));
// #end-store
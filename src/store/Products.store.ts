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
      
      for (const [categoryId, products] of newMap.entries()) {
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
          const updatedProducts = [...products];
          const currentProduct = updatedProducts[index];
          
          // Si se actualiza images o tags, necesitamos re-parsear todo el producto
          if (updates.images !== undefined || updates.tags !== undefined) {
            let imagesValue: string | null = null;
            if (updates.images !== undefined) {
              imagesValue = typeof updates.images === 'string' ? updates.images : null;
            } else if (currentProduct.images.length > 0) {
              imagesValue = JSON.stringify(currentProduct.images);
            }
            
            let tagsValue: string | null = null;
            if (updates.tags !== undefined) {
              tagsValue = typeof updates.tags === 'string' ? updates.tags : null;
            } else if (currentProduct.tags && currentProduct.tags.length > 0) {
              tagsValue = JSON.stringify(currentProduct.tags);
            }
            
            const productToParse: Product = {
              id: currentProduct.id,
              categoryId: currentProduct.categoryId,
              name: updates.name ?? currentProduct.name,
              description: updates.description ?? currentProduct.description,
              images: imagesValue,
              tags: tagsValue,
              basePrice: updates.basePrice?.toString() ?? currentProduct.basePrice,
              discount: updates.discount?.toString() ?? currentProduct.discount,
              hasStockControl: updates.hasStockControl ?? currentProduct.hasStockControl,
              currentStock: updates.currentStock ?? currentProduct.currentStock,
              stockAlertThreshold: updates.stockAlertThreshold ?? currentProduct.stockAlertThreshold,
              stockStopThreshold: updates.stockStopThreshold ?? currentProduct.stockStopThreshold,
              isAvailable: updates.isAvailable ?? currentProduct.isAvailable,
              sortOrder: updates.sortOrder ?? currentProduct.sortOrder,
              createdAt: currentProduct.createdAt,
              updatedAt: currentProduct.updatedAt
            };
            updatedProducts[index] = parseProductImages(productToParse);
          } else {
            // Actualizar campos preservando explícitamente images y tags parseados
            updatedProducts[index] = {
              ...currentProduct,
              name: updates.name ?? currentProduct.name,
              description: updates.description ?? currentProduct.description,
              basePrice: updates.basePrice?.toString() ?? currentProduct.basePrice,
              discount: updates.discount?.toString() ?? currentProduct.discount,
              hasStockControl: updates.hasStockControl ?? currentProduct.hasStockControl,
              currentStock: updates.currentStock ?? currentProduct.currentStock,
              stockAlertThreshold: updates.stockAlertThreshold ?? currentProduct.stockAlertThreshold,
              stockStopThreshold: updates.stockStopThreshold ?? currentProduct.stockStopThreshold,
              isAvailable: updates.isAvailable ?? currentProduct.isAvailable,
              sortOrder: updates.sortOrder ?? currentProduct.sortOrder,
              // Preservar explícitamente los campos parseados
              images: currentProduct.images,
              mainImage: currentProduct.mainImage,
              tags: currentProduct.tags
            };
          }
          
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
      
      for (const [categoryId, products] of newMap.entries()) {
        let hasChanges = false;
        const updatedProducts = products.map(product => {
          const update = updates.find(u => u.id === product.id);
          if (!update) return product;
          
          hasChanges = true;
          
          // Si actualiza images o tags, re-parsear
          if (update.updates.images !== undefined || update.updates.tags !== undefined) {
            let imagesValue: string | null = null;
            if (update.updates.images !== undefined) {
              imagesValue = typeof update.updates.images === 'string' ? update.updates.images : null;
            } else if (product.images.length > 0) {
              imagesValue = JSON.stringify(product.images);
            }
            
            let tagsValue: string | null = null;
            if (update.updates.tags !== undefined) {
              tagsValue = typeof update.updates.tags === 'string' ? update.updates.tags : null;
            } else if (product.tags && product.tags.length > 0) {
              tagsValue = JSON.stringify(product.tags);
            }
            
            const productToParse: Product = {
              id: product.id,
              categoryId: product.categoryId,
              name: update.updates.name ?? product.name,
              description: update.updates.description ?? product.description,
              images: imagesValue,
              tags: tagsValue,
              basePrice: update.updates.basePrice?.toString() ?? product.basePrice,
              discount: update.updates.discount?.toString() ?? product.discount,
              hasStockControl: update.updates.hasStockControl ?? product.hasStockControl,
              currentStock: update.updates.currentStock ?? product.currentStock,
              stockAlertThreshold: update.updates.stockAlertThreshold ?? product.stockAlertThreshold,
              stockStopThreshold: update.updates.stockStopThreshold ?? product.stockStopThreshold,
              isAvailable: update.updates.isAvailable ?? product.isAvailable,
              sortOrder: update.updates.sortOrder ?? product.sortOrder,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt
            };
            return parseProductImages(productToParse);
          }
          
          // Actualizar campos preservando explícitamente images y tags parseados
          return {
            ...product,
            name: update.updates.name ?? product.name,
            description: update.updates.description ?? product.description,
            basePrice: update.updates.basePrice?.toString() ?? product.basePrice,
            discount: update.updates.discount?.toString() ?? product.discount,
            hasStockControl: update.updates.hasStockControl ?? product.hasStockControl,
            currentStock: update.updates.currentStock ?? product.currentStock,
            stockAlertThreshold: update.updates.stockAlertThreshold ?? product.stockAlertThreshold,
            stockStopThreshold: update.updates.stockStopThreshold ?? product.stockStopThreshold,
            isAvailable: update.updates.isAvailable ?? product.isAvailable,
            sortOrder: update.updates.sortOrder ?? product.sortOrder,
            // Preservar explícitamente los campos parseados
            images: product.images,
            mainImage: product.mainImage,
            tags: product.tags
          };
        });
        
        if (hasChanges) {
          const hasOrderUpdate = updates.some(u => u.updates.sortOrder !== undefined);
          const finalProducts = hasOrderUpdate
            ? updatedProducts.sort((a, b) => a.sortOrder - b.sortOrder)
            : updatedProducts;
          
          newMap.set(categoryId, finalProducts);
        }
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
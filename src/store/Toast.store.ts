/* src/store/Toast.store.ts */
// #section Imports
import { create } from 'zustand';
// #end-section

// #type ToastType
export type ToastType = 'success' | 'error' | 'info' | 'warning';
// #end-type

// #interface Toast
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
// #end-interface

// #interface ToastStore
interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}
// #end-interface

// #store useToastStore
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (type, message, duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }]
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
// #end-store
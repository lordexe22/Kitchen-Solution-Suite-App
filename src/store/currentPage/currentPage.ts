// src\store\currentPage\currentPage.ts

import { create } from "zustand";
import { type useStoreCurrentPageType } from "./type";

export const useStoreCurrentPage = create<useStoreCurrentPageType>((set) => ({
  currentPage: 'main',
  changeCurrentPage: (newPage) => set({currentPage: newPage})
}))


// src\store\currentPage\type.ts

export interface useStoreCurrentPageType {
  currentPage: 'main' | 'register' | 'login'
  changeCurrentPage: (newPage: 'main' | 'register' | 'login') => void 
}

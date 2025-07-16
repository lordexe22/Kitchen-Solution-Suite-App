// src\store\currentPage\type.ts

export interface useStoreCurrentPageType {
  currentPage: 'main' | 'register' | 'login' | 'user';
  changeCurrentPage: (newPage: 'main' | 'register' | 'login' | 'user') => void;
}


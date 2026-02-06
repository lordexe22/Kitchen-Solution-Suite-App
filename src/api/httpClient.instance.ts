// src/api/httpClient.instance.ts
// #section Imports
// Nueva instancia del HttpClient standalone
import { HttpClient } from '../modules/httpClient';

export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

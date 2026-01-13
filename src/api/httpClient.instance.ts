// src/api/httpClient.instance.ts
// #section Imports
import axios from 'axios';
// #end-section

// #const API_BASE_URL - Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// #end-const

// #const httpClient - Axios instance configured for API requests
/**
 * Axios instance configured with base URL and credentials support.
 * Automatically includes cookies in requests.
 */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
// #end-const

// #section Response interceptor for data extraction
httpClient.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    if (error.response) {
      throw new Error(error.response.data?.error || 'Request failed');
    }
    throw error;
  }
);
// #end-section

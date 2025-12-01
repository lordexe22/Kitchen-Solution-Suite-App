/* src/services/public/menu.service.ts */
// #section Imports
import type { 
  PublicBranchMenu,
  PublicBranchInfo,
  PublicProductDetail
 } from "./menu.types";
// #end-section
// #const BASE_URL
const BASE_URL = 'http://localhost:4000';
// #end-const
// #function getBranchMenu
/**
 * Obtiene el menú completo de una sucursal (categorías + productos).
 * Endpoint público (sin autenticación).
 * 
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<PublicBranchMenu>} Menú de la sucursal
 */
export const getBranchMenu = async (branchId: number): Promise<PublicBranchMenu> => {
  const response = await fetch(
    `${BASE_URL}/api/public/branches/${branchId}/menu`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener el menú de la sucursal');
  }

  const result = await response.json();
  return result.data;
};
// #end-function
// #function getBranchInfo
/**
 * Obtiene información de la sucursal (compañía, horarios, redes sociales).
 * Endpoint público (sin autenticación).
 * 
 * @param {number} branchId - ID de la sucursal
 * @returns {Promise<PublicBranchInfo>} Información de la sucursal
 */
export const getBranchInfo = async (branchId: number): Promise<PublicBranchInfo> => {
  const response = await fetch(
    `${BASE_URL}/api/public/branches/${branchId}/info`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener información de la sucursal');
  }

  const result = await response.json();
  return result.data;
};
// #end-function
// #function getProductDetail
/**
 * Obtiene el detalle completo de un producto.
 * Endpoint público (sin autenticación).
 * 
 * @param {number} productId - ID del producto
 * @returns {Promise<PublicProductDetail>} Detalle del producto
 */
export const getProductDetail = async (productId: number): Promise<PublicProductDetail> => {
  const response = await fetch(
    `${BASE_URL}/api/public/products/${productId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al obtener detalle del producto');
  }

  const result = await response.json();
  return result.data;
};
// #end-function
/* src/components/ClientPreviewModalWindow/ClientPreviewModalWindow.types.ts */
// #section imports
import type { PublicBranchMenu } from '../../services/public/menu.types';
import type { ProductWithCalculatedPrice } from '../../store/Products.types';
// #end-section

// #interface ClientPreviewModalWindowProps
/**
 * Props del modal de vista de cliente.
 */
export interface ClientPreviewModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
}
// #end-interface

// #interface ClientPreviewState
/**
 * Estado local del componente.
 */
export interface ClientPreviewState {
  loading: boolean;
  error: string | null;
  data: PublicBranchMenu | null;
  expandedCategoryIds: Set<number>;
  selectedProduct: ProductWithCalculatedPrice | null;
  isDetailModalOpen: boolean;
}
// #end-interface
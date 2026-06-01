import type { CustomOrderStatus } from '../types/custom-orders.types';

export interface CustomOrderProduct {
  id: string;
  name: string;
  currentStock: number;
}

export interface CustomOrderCustomizationDetails {
  clientName?: string;
  description?: string;
  quantity?: number;
  notes?: string;
  [key: string]: unknown;
}

export interface CustomOrder {
  id: string;
  clientId: string;
  productId: string;
  adminId: string;
  customizationDetails: CustomOrderCustomizationDetails;
  status: CustomOrderStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  product: CustomOrderProduct | null;
}

export interface KanbanColumnData {
  status: CustomOrderStatus;
  label: string;
  orders: CustomOrder[];
}

export interface KanbanCardProps {
  order: CustomOrder;
  onMoveToStatus: (orderId: string, newStatus: CustomOrderStatus) => void;
  isUpdating: boolean;
}

export interface KanbanColumnProps {
  column: KanbanColumnData;
  availableStatuses: CustomOrderStatus[];
  onDrop: (orderId: string, newStatus: CustomOrderStatus) => void;
  onMoveToStatus: (orderId: string, newStatus: CustomOrderStatus) => void;
  updatingId: string | null;
}

export interface KanbanBoardProps {
  columns: KanbanColumnData[];
  availableStatuses: CustomOrderStatus[];
  onMoveOrder: (orderId: string, newStatus: CustomOrderStatus) => void;
  updatingId: string | null;
}

export interface UseCustomOrdersResult {
  columns: KanbanColumnData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseUpdateCustomOrderStatusResult {
  updateStatus: (orderId: string, newStatus: CustomOrderStatus) => Promise<void>;
  updatingId: string | null;
  error: string | null;
}

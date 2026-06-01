import type { RefObject } from 'react';
import type { Notification, OrderNotificationContent, OrderNotificationProduct } from '@/features/notifications/types/notifications.types';

export interface CustomOrder {
  notification: Notification;
  content: OrderNotificationContent;
}

export interface UseCustomOrdersResult {
  orders: CustomOrder[];
  isLoading: boolean;
  isError: boolean;
  pendingCount: number;
  updateStatus: (id: string, status: 'accepted' | 'rejected', reason?: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export type UpdateStatusFn = (id: string, status: 'accepted' | 'rejected', reason?: string) => Promise<void>;

export interface CustomOrderCardProps {
  order: CustomOrder;
  onStatusUpdate: UpdateStatusFn;
}

export interface OrderListProps {
  orders: CustomOrder[];
  highlightOrderId: string | null;
  highlightRef: RefObject<HTMLLIElement | null>;
  onStatusUpdate: UpdateStatusFn;
}

export interface CustomOrderActionsProps {
  notificationId: string;
  orderId: string;
  isPending: boolean;
  isAccepted: boolean;
  clientEmail?: string;
  onStatusUpdate: UpdateStatusFn;
}

export interface CustomOrderProductListProps {
  products: OrderNotificationProduct[];
}

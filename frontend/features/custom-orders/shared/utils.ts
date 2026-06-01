import type { CustomOrder, KanbanColumnData } from '../models/custom-orders.models';
import type { CustomOrderStatus } from '../types/custom-orders.types';
import { CUSTOM_ORDER_STATUS_LABELS } from '../constants/messages';

export const KANBAN_COLUMN_ORDER: CustomOrderStatus[] = ['received', 'in_process', 'ready', 'sold'];

export const groupOrdersByStatus = (orders: CustomOrder[]): KanbanColumnData[] => {
  const grouped = new Map<CustomOrderStatus, CustomOrder[]>(
    KANBAN_COLUMN_ORDER.map((s) => [s, []]),
  );

  for (const order of orders) {
    if (grouped.has(order.status)) {
      grouped.get(order.status)!.push(order);
    }
  }

  return KANBAN_COLUMN_ORDER.map((status) => ({
    status,
    label: CUSTOM_ORDER_STATUS_LABELS[status],
    orders: grouped.get(status)!,
  }));
};

export const formatOrderDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getClientName = (order: CustomOrder): string | null => {
  return order.customizationDetails?.clientName ?? null;
};

export const getOrderDescription = (order: CustomOrder): string | null => {
  return order.customizationDetails?.description ?? null;
};

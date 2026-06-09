'use client';

import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE_CLASSES } from '../constants/orders.constants';
import type { OrderStatus } from '../types/orders.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_BADGE_CLASSES[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
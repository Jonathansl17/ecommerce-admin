'use client';

import type { CSSProperties } from 'react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE_STYLES } from '../constants/orders.constants';
import type { OrderStatus } from '../types/orders.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const style: CSSProperties = ORDER_STATUS_BADGE_STYLES[status];
  const label = ORDER_STATUS_LABELS[status];

  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-medium"
      style={style}
    >
      {label}
    </span>
  );
}

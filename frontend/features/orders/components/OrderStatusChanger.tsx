'use client';

import { Select } from '@/components/ui/Select';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderStatus } from '../types/orders.types';

const { status: s } = ORDERS_STRINGS;

interface OrderStatusChangerProps {
  currentStatus: OrderStatus;
  disabled: boolean;
  onChange: (status: OrderStatus) => void;
}

export function OrderStatusChanger({
  currentStatus,
  disabled,
  onChange,
}: OrderStatusChangerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus;
    if (next !== currentStatus) {
      onChange(next);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-medium text-muted-foreground"
        htmlFor="order-status-changer"
      >
        {s.changeLabel}
      </label>
      <Select
        id="order-status-changer"
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled}
        aria-label={s.changeLabel}
      >
        {ORDER_STATUSES.map((st) => (
          <option key={st} value={st}>
            {ORDER_STATUS_LABELS[st]}
          </option>
        ))}
      </Select>
      {disabled && (
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {s.changingLabel}
        </span>
      )}
    </div>
  );
}

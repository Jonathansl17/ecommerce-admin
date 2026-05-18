'use client';

import { useState } from 'react';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderFilters, OrderStatus } from '../types/orders.types';

const { filters: s } = ORDERS_STRINGS;

interface OrderFiltersBarProps {
  onChange: (filters: Omit<OrderFilters, 'limit' | 'offset'>) => void;
}

export function OrderFiltersBar({ onChange }: OrderFiltersBarProps) {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleApply = () => {
    onChange({
      ...(status ? { status } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    });
  };

  const handleClear = () => {
    setStatus('');
    setFrom('');
    setTo('');
    onChange({});
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
      {/* Status select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-filter-status">
          {s.statusLabel}
        </label>
        <select
          id="orders-filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{s.statusAll}</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* From date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-filter-from">
          {s.fromLabel}
        </label>
        <input
          id="orders-filter-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* To date */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-filter-to">
          {s.toLabel}
        </label>
        <input
          id="orders-filter-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          {s.applyButton}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {s.clearButton}
        </button>
      </div>
    </div>
  );
}

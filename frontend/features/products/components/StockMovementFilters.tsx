'use client';

import { useState } from 'react';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_ADJUSTMENT_REASON_OPTIONS } from '../constants/validation';
import type { StockMovementFilters } from '../types/stock-movement';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementFiltersProps {
  onFilterChange: (filters: StockMovementFilters) => void;
}

export function StockMovementFilters({ onFilterChange }: StockMovementFiltersProps) {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onFilterChange({
      reason: reason ? (reason as StockMovementFilters['reason']) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1,
    });
  };

  const handleClear = () => {
    setReason('');
    setStartDate('');
    setEndDate('');
    onFilterChange({ page: 1 });
  };

  return (
    <div className="rounded-lg border border-foreground/10 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.filterByReason}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            <option value="">{strings.filterAllReasons}</option>
            {STOCK_ADJUSTMENT_REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.filterStartDate}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.filterEndDate}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          {strings.applyFilters}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-foreground/20 text-foreground/70 text-sm rounded-md hover:bg-foreground/5 transition-colors"
        >
          {strings.clearFilters}
        </button>
      </div>
    </div>
  );
}

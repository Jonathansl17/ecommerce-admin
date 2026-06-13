'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
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
          <Select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">{strings.filterAllReasons}</option>
            {STOCK_ADJUSTMENT_REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.filterStartDate}
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.filterEndDate}
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply}>{strings.applyFilters}</Button>
        <Button variant="outline" onClick={handleClear}>
          {strings.clearFilters}
        </Button>
      </div>
    </div>
  );
}

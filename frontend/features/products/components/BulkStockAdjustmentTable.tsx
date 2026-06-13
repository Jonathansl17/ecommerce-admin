'use client';

import { useState, useMemo, useCallback } from 'react';
import { useBulkAdjustStock } from '../hooks/useBulkAdjustStock';
import { BulkStockAdjustmentRow } from './BulkStockAdjustmentRow';
import { BulkAdjustmentSummary } from './BulkAdjustmentSummary';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_ADJUSTMENT_REASON_OPTIONS, BULK_ADJUSTMENT_VALIDATION } from '../constants/validation';
import type { BulkAdjustmentRow, BulkAdjustStockResponse, StockAdjustmentReason, Product } from '../types/products.types';

interface BulkStockAdjustmentTableProps {
  products: Product[];
  onDone: () => void;
}

export function BulkStockAdjustmentTable({ products, onDone }: BulkStockAdjustmentTableProps) {
  const [rows, setRows] = useState<BulkAdjustmentRow[]>(
    products.map((p) => ({
      productId: p.id,
      productName: p.name,
      currentStock: p.currentStock,
      newStock: null,
      isSelected: false,
    }))
  );

  const [reason, setReason] = useState<StockAdjustmentReason>('manual_adjustment');
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState<BulkAdjustStockResponse | null>(null);

  const { bulkAdjust, isLoading, error } = useBulkAdjustStock((response) => {
    setSummary(response);
  });

  const strings = PRODUCTS_MESSAGES.bulk;

  const readyToAdjust = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.isSelected &&
          row.newStock !== null &&
          row.newStock !== row.currentStock &&
          row.newStock >= BULK_ADJUSTMENT_VALIDATION.NEW_STOCK_MIN
      ),
    [rows]
  );

  const allSelected = rows.every((r) => r.isSelected);
  const someSelected = rows.some((r) => r.isSelected);

  const handleToggleAll = useCallback((checked: boolean) => {
    setRows((prev) => prev.map((row) => ({ ...row, isSelected: checked })));
  }, []);

  const handleRowChange = useCallback(
    (productId: string, updates: Partial<BulkAdjustmentRow>) => {
      setRows((prev) =>
        prev.map((row) => (row.productId === productId ? { ...row, ...updates } : row))
      );
    },
    []
  );

  const handleSubmit = async () => {
    if (readyToAdjust.length < BULK_ADJUSTMENT_VALIDATION.MIN_SELECTED) return;

    await bulkAdjust({
      adjustments: readyToAdjust.map((row) => ({
        productId: row.productId,
        newStock: row.newStock!,
      })),
      reason,
      note: note || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-foreground/10 p-4">
        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.reasonLabel}
          </label>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value as StockAdjustmentReason)}
            disabled={isLoading}
          >
            {STOCK_ADJUSTMENT_REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 block mb-1">
            {strings.noteLabel}
          </label>
          <Input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={BULK_ADJUSTMENT_VALIDATION.NOTE_MAX_LENGTH}
            disabled={isLoading}
            className="text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left text-foreground/70">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                  disabled={isLoading}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 font-medium">{strings.colProduct}</th>
              <th className="px-4 py-3 font-medium">{strings.colCurrentStock}</th>
              <th className="px-4 py-3 font-medium">{strings.colNewStock}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {rows.map((row) => (
              <BulkStockAdjustmentRow
                key={row.productId}
                row={row}
                onChange={handleRowChange}
                disabled={isLoading}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          {strings.selectedCount(readyToAdjust.length)}
        </p>
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText={strings.applyingButton}
          disabled={isLoading || readyToAdjust.length < BULK_ADJUSTMENT_VALIDATION.MIN_SELECTED}
        >
          {strings.applyButton}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {summary && (
        <BulkAdjustmentSummary
          summary={summary}
          onClose={() => {
            setSummary(null);
            onDone();
          }}
        />
      )}
    </div>
  );
}

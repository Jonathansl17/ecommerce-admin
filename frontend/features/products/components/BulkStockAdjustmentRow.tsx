import { BULK_ADJUSTMENT_VALIDATION } from '../constants/validation';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { BulkAdjustmentRow } from '../types/products.types';

interface BulkStockAdjustmentRowProps {
  row: BulkAdjustmentRow;
  onChange: (productId: string, updates: Partial<BulkAdjustmentRow>) => void;
  disabled?: boolean;
}

export function BulkStockAdjustmentRow({ row, onChange, disabled }: BulkStockAdjustmentRowProps) {
  const isSameStock = row.newStock !== null && row.newStock === row.currentStock;

  return (
    <tr
      className={`hover:bg-foreground/5 transition-colors ${row.isSelected ? 'bg-info/10' : ''}`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={row.isSelected}
          onChange={(e) => onChange(row.productId, { isSelected: e.target.checked })}
          disabled={disabled}
          className="rounded"
        />
      </td>

      <td className="px-4 py-3 font-medium text-foreground">{row.productName}</td>

      <td className="px-4 py-3 text-foreground/70">{row.currentStock}</td>

      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            min={BULK_ADJUSTMENT_VALIDATION.NEW_STOCK_MIN}
            max={BULK_ADJUSTMENT_VALIDATION.NEW_STOCK_MAX}
            value={row.newStock ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : Number(e.target.value);
              onChange(row.productId, {
                newStock: value,
                isSelected: value !== null,
              });
            }}
            disabled={disabled}
            placeholder="—"
            className={`w-28 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
              isSameStock
                ? 'border-warning/40 bg-warning/20 text-warning-foreground'
                : 'border-foreground/20 bg-background text-foreground'
            }`}
          />
          {isSameStock && (
            <span className="text-xs text-warning-foreground">
              {PRODUCTS_MESSAGES.bulk.sameStockWarning}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

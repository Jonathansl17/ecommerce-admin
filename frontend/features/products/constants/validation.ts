import type { StockAdjustmentReason } from '../types/products.types';

export const STOCK_ADJUSTMENT_VALIDATION = {
  NEW_STOCK_MIN: 0,
  NOTE_MAX_LENGTH: 500,
} as const;

export const STOCK_ADJUSTMENT_REASON_LABELS: Record<StockAdjustmentReason, string> = {
  manual_adjustment: 'Ajuste manual',
  error_correction: 'Corrección de error',
  damaged_product: 'Producto dañado',
  return: 'Devolución',
};

export const STOCK_ADJUSTMENT_REASON_OPTIONS = (
  Object.entries(STOCK_ADJUSTMENT_REASON_LABELS) as [StockAdjustmentReason, string][]
).map(([value, label]) => ({ value, label }));

export const BULK_ADJUSTMENT_VALIDATION = {
  MIN_SELECTED: 1,
  NEW_STOCK_MIN: 0,
  NEW_STOCK_MAX: 999999,
  NOTE_MAX_LENGTH: 500,
} as const;

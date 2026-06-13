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

export const CREATE_PRODUCT_VALIDATION = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PRICE: {
    MIN: 1,
    MAX: 999999,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
} as const;

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active' as const, label: 'Activo' },
  { value: 'inactive' as const, label: 'Inactivo' },
];

export const THRESHOLD_VALIDATION = {
  MIN: 1,
  MAX: 999999,
} as const;

export const PRODUCT_IMAGE_VALIDATION = {
  ACCEPT: 'image/jpeg,image/png,image/webp,image/gif',
  MAX_SIZE_MB: 2,
} as const;

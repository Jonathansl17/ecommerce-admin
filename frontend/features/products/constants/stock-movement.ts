import type { StockMovementReason } from '../types/stock-movement';

export const STOCK_MOVEMENT_REASON_LABELS: Record<StockMovementReason, string> = {
  manual_adjustment: 'Ajuste Manual',
  error_correction: 'Corrección de Error',
  damaged_product: 'Producto Dañado',
  return: 'Devolución',
};

export const STOCK_MOVEMENT_REASON_COLORS: Record<StockMovementReason, string> = {
  manual_adjustment: 'bg-blue-100 text-blue-700',
  error_correction: 'bg-yellow-100 text-yellow-700',
  damaged_product: 'bg-red-100 text-red-700',
  return: 'bg-green-100 text-green-700',
};

export const STOCK_MOVEMENT_PAGINATION = {
  DEFAULT_LIMIT: 20,
} as const;

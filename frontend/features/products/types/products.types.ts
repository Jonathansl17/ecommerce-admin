export type StockAdjustmentReason =
  | 'manual_adjustment'
  | 'error_correction'
  | 'damaged_product'
  | 'return';

export interface AdjustStockForm {
  newStock: number;
  reason: StockAdjustmentReason;
  note?: string;
}

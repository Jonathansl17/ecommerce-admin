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

export interface BulkAdjustmentRow {
  supplyId: string;
  name: string;
  currentStock: number;
  newStock: number | null;
  isSelected: boolean;
  unitOfMeasure: string;
}

export interface BulkAdjustmentItem {
  supplyId: string;
  newStock: number;
}

export interface BulkAdjustStockRequest {
  adjustments: BulkAdjustmentItem[];
  reason: StockAdjustmentReason;
  note?: string;
}

export interface BulkAdjustmentResult {
  supplyId: string;
  success: boolean;
  newStock?: number;
  error?: string;
}

export interface BulkAdjustStockResponse {
  results: BulkAdjustmentResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

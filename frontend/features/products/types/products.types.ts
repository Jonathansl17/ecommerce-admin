export type ProductStatus = 'active' | 'inactive';

export type StockAdjustmentReason =
  | 'manual_adjustment'
  | 'error_correction'
  | 'damaged_product'
  | 'return';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  status: ProductStatus;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  priceOverride?: number | null;
}

export interface AdjustStockForm {
  newStock: number;
  reason: StockAdjustmentReason;
  note?: string;
}

export interface BulkAdjustmentRow {
  productId: string;
  productName: string;
  currentStock: number;
  newStock: number | null;
  isSelected: boolean;
}

export interface BulkAdjustmentItem {
  productId: string;
  newStock: number;
}

export interface BulkAdjustStockRequest {
  adjustments: BulkAdjustmentItem[];
  reason: StockAdjustmentReason;
  note?: string;
}

export interface BulkAdjustmentResult {
  productId: string;
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

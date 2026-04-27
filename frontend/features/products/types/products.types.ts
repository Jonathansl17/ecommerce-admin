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
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  priceOverride?: number | null;
  currentStock: number;
}

export interface AdjustStockForm {
  newStock: number;
  reason: StockAdjustmentReason;
  note?: string;
}

export interface BulkAdjustmentRow {
  variantId: string;
  productName: string;
  variantName: string;
  currentStock: number;
  newStock: number | null;
  isSelected: boolean;
}

export interface BulkAdjustmentItem {
  variantId: string;
  newStock: number;
}

export interface BulkAdjustStockRequest {
  adjustments: BulkAdjustmentItem[];
  reason: StockAdjustmentReason;
  note?: string;
}

export interface BulkAdjustmentResult {
  variantId: string;
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

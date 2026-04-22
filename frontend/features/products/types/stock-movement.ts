export type StockMovementType = 'sale' | 'manual_adjustment';

export type StockMovementReason =
  | 'manual_adjustment'
  | 'error_correction'
  | 'damaged_product'
  | 'return';

export interface StockMovementAdmin {
  adminUser: {
    fullName: string;
  };
}

export interface StockMovement {
  id: string;
  previousQuantity: number;
  newQuantity: number;
  reason: StockMovementReason | null;
  note: string | null;
  type: StockMovementType;
  createdAt: string;
  admin: StockMovementAdmin;
}

export interface StockMovementPagination {
  page: number;
  limit: number;
  total: number;
}

export interface StockMovementResponse {
  data: StockMovement[];
  pagination: StockMovementPagination;
}

export interface StockMovementFilters {
  reason?: StockMovementReason;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

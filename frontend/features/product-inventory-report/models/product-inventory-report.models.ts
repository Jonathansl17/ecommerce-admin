export type StockStatus = 'available' | 'low' | 'out_of_stock' | 'all';

export type ProductStatus = 'active' | 'inactive';

export interface InventoryProductVariant {
  id: string;
  productId: string;
  name: string;
  priceOverride: number | null;
}

export interface InventoryProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  currentStock: number;
  minThreshold: number | null;
  isCustomizable: boolean;
  createdAt: string;
  updatedAt: string;
  variants: InventoryProductVariant[];
}

export interface InventoryReportFilters {
  search: string;
  stockStatus: StockStatus;
}

export interface InventoryReportRow {
  productId: string;
  productName: string;
  variantName: string | null;
  currentStock: number;
  minThreshold: number | null;
  stockStatus: StockStatus;
  isCustomizable: boolean;
}

export interface PartitionedRows {
  standardRows: InventoryReportRow[];
  customRows: InventoryReportRow[];
}

export interface UseProductInventoryReportResult extends PartitionedRows {
  isLoading: boolean;
  error: string | null;
  filters: InventoryReportFilters;
  setSearch: (search: string) => void;
  setStockStatus: (status: StockStatus) => void;
  refetch: () => void;
}

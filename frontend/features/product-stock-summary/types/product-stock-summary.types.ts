import type { Product } from '@/features/products/types/products.types';
import type { AlertSeverity } from '@/features/stock-alerts/types/stock-alert.types';

export interface StockSummaryItem {
  product: Product;
  severity: AlertSeverity;
}

export interface UseProductStockSummaryResult {
  items: StockSummaryItem[];
  outOfStockCount: number;
  lowStockCount: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

import type { StockStatus } from '../models/product-inventory-report.models';

export const STOCK_STATUS_VALUES: StockStatus[] = ['all', 'available', 'low', 'out_of_stock'];

export const INITIAL_FILTERS = {
  search: '',
  stockStatus: 'all' as StockStatus,
} as const;

import type { StockSummaryItem } from '../types/product-stock-summary.types';

export const partitionStockItems = (
  items: StockSummaryItem[],
): { outOfStock: StockSummaryItem[]; lowStock: StockSummaryItem[] } => {
  const outOfStock = items.filter((i) => i.severity === 'out_of_stock');
  const lowStock = items.filter((i) => i.severity === 'low_stock');
  return { outOfStock, lowStock };
};

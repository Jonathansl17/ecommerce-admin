import type {
  InventoryProduct,
  InventoryReportFilters,
  InventoryReportRow,
  PartitionedRows,
  StockStatus,
} from '../models/product-inventory-report.models';

export const computeStockStatus = (
  currentStock: number,
  minThreshold: number | null
): StockStatus => {
  if (currentStock <= 0) return 'out_of_stock';
  if (minThreshold !== null && currentStock <= minThreshold) return 'low';
  return 'available';
};

export const buildReportRows = (products: InventoryProduct[]): InventoryReportRow[] =>
  products.flatMap((product) => {
    const stockStatus = computeStockStatus(product.currentStock, product.minThreshold);

    if (product.variants.length === 0) {
      const row: InventoryReportRow = {
        productId: product.id,
        productName: product.name,
        variantName: null,
        currentStock: product.currentStock,
        minThreshold: product.minThreshold,
        stockStatus,
        isCustomizable: product.isCustomizable,
      };
      return [row];
    }

    return product.variants.map((variant): InventoryReportRow => ({
      productId: product.id,
      productName: product.name,
      variantName: variant.name,
      currentStock: product.currentStock,
      minThreshold: product.minThreshold,
      stockStatus,
      isCustomizable: product.isCustomizable,
    }));
  });

export const matchesSearch = (row: InventoryReportRow, search: string): boolean => {
  if (!search.trim()) return true;
  return row.productName.toLowerCase().includes(search.toLowerCase().trim());
};

export const matchesStockStatus = (row: InventoryReportRow, status: StockStatus): boolean => {
  if (status === 'all') return true;
  return row.stockStatus === status;
};

export const filterRows = (
  rows: InventoryReportRow[],
  filters: InventoryReportFilters
): InventoryReportRow[] =>
  rows.filter(
    (row) => matchesSearch(row, filters.search) && matchesStockStatus(row, filters.stockStatus)
  );

export const partitionRowsByCustomizable = (rows: InventoryReportRow[]): PartitionedRows => ({
  standardRows: rows.filter((row) => !row.isCustomizable),
  customRows: rows.filter((row) => row.isCustomizable),
});

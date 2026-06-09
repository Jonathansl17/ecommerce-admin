'use client';

import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { useProductInventoryReport } from '../hooks/useProductInventoryReport';
import { InventoryReportFilters } from './InventoryReportFilters';
import { InventoryReportTable } from './InventoryReportTable';
import { CustomProductsSection } from './CustomProductsSection';

const strings = INVENTORY_REPORT_MESSAGES;

export function ProductInventoryReport() {
  const {
    standardRows,
    customRows,
    isLoading,
    error,
    filters,
    setSearch,
    setStockStatus,
    refetch,
  } = useProductInventoryReport();

  if (isLoading) {
    return <p className="text-sm text-foreground/60">{strings.loading}</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-sm text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-foreground/60 underline hover:text-foreground transition-colors"
        >
          {strings.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <InventoryReportFilters
        filters={filters}
        onSearchChange={setSearch}
        onStockStatusChange={setStockStatus}
      />

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          {strings.sections.standardTitle}
        </h2>
        <InventoryReportTable rows={standardRows} />
      </div>

      <div className="border-t border-foreground/10 pt-6">
        <CustomProductsSection rows={customRows} />
      </div>
    </div>
  );
}

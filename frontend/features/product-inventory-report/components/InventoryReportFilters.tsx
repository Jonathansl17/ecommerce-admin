import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { STOCK_STATUS_VALUES } from '../constants/filters';
import type { InventoryReportFilters, StockStatus } from '../models/product-inventory-report.models';

const strings = INVENTORY_REPORT_MESSAGES;

interface InventoryReportFiltersProps {
  filters: InventoryReportFilters;
  onSearchChange: (search: string) => void;
  onStockStatusChange: (status: StockStatus) => void;
}

export function InventoryReportFilters({
  filters,
  onSearchChange,
  onStockStatusChange,
}: InventoryReportFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-foreground/10 bg-background p-4">
      <div className="space-y-1 flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-foreground/60">
          {strings.filters.searchLabel}
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={strings.filters.searchPlaceholder}
          className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/30"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-foreground/60">
          {strings.filters.stockStatusLabel}
        </label>
        <select
          value={filters.stockStatus}
          onChange={(e) => onStockStatusChange(e.target.value as StockStatus)}
          className="rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
        >
          {STOCK_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {strings.stockStatus[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

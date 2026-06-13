import { Select } from '@/components/ui/Select';
import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { STOCK_STATUS_VALUES } from '../constants/filters';
import { INVENTORY_REPORT_FILTERS_STYLES as styles } from '../constants/styles';
import type { InventoryReportFiltersProps, StockStatus } from '../models/product-inventory-report.models';

const strings = INVENTORY_REPORT_MESSAGES;

export function InventoryReportFilters({
  filters,
  onSearchChange,
  onStockStatusChange,
}: InventoryReportFiltersProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchGroup}>
        <label className={styles.label}>
          {strings.filters.searchLabel}
        </label>
        <input
          type={styles.inputType}
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={strings.filters.searchPlaceholder}
          className={styles.input}
        />
      </div>

      <div className={styles.selectGroup}>
        <label className={styles.label}>
          {strings.filters.stockStatusLabel}
        </label>
        <Select
          value={filters.stockStatus}
          onChange={(e) => onStockStatusChange(e.target.value as StockStatus)}
        >
          {STOCK_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {strings.stockStatus[status]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

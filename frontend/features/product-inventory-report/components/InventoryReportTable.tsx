import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import type { InventoryReportRow, InventoryReportTableProps, StockStatus } from '../models/product-inventory-report.models';

const strings = INVENTORY_REPORT_MESSAGES;

const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  available: 'bg-green-100 text-green-700',
  low: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
  all: '',
};

export function InventoryReportTable({
  rows,
  emptyMessage = strings.table.emptyMessage,
  embedded = false,
}: InventoryReportTableProps) {
  if (rows.length === 0) {
    return (
      <p className={`text-sm text-foreground/60 ${embedded ? 'px-4 py-3' : ''}`}>{emptyMessage}</p>
    );
  }

  return (
    <div
      className={embedded ? 'overflow-x-auto' : 'overflow-x-auto rounded-lg border border-foreground/10'}
    >
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left text-foreground/70">
          <tr>
            <th className="px-4 py-3 font-medium">{strings.table.colProduct}</th>
            <th className="px-4 py-3 font-medium">{strings.table.colVariant}</th>
            <th className="px-4 py-3 font-medium text-right">{strings.table.colStock}</th>
            <th className="px-4 py-3 font-medium text-right">{strings.table.colThreshold}</th>
            <th className="px-4 py-3 font-medium">{strings.table.colStatus}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {rows.map((row, index) => (
            <tr
              key={`${row.productId}-${row.variantName ?? 'base'}-${index}`}
              className="hover:bg-foreground/5 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-foreground">{row.productName}</td>
              <td className="px-4 py-3 text-foreground/60">
                {row.variantName ?? strings.table.noVariant}
              </td>
              <td className="px-4 py-3 text-right text-foreground/70">{row.currentStock}</td>
              <td className="px-4 py-3 text-right text-foreground/60">
                {row.minThreshold !== null ? row.minThreshold : strings.table.noThreshold}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STOCK_STATUS_STYLES[row.stockStatus]}`}
                >
                  {strings.stockStatus[row.stockStatus]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

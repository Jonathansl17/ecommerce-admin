import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { InventoryReportTable } from './InventoryReportTable';
import type { CustomProductsSectionProps } from '../models/product-inventory-report.models';

const strings = INVENTORY_REPORT_MESSAGES.sections;

export function CustomProductsSection({ rows }: CustomProductsSectionProps) {
  return (
    <div className="rounded-lg border border-foreground/10">
      <div className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{strings.customTitle}</h2>
        <p className="mt-0.5 text-xs text-foreground/50">{strings.customSubtitle}</p>
      </div>
      <InventoryReportTable rows={rows} emptyMessage={strings.customEmpty} embedded />
    </div>
  );
}

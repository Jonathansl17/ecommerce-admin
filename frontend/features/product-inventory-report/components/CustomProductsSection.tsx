import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { InventoryReportTable } from './InventoryReportTable';
import type { CustomProductsSectionProps } from '../models/product-inventory-report.models';

const strings = INVENTORY_REPORT_MESSAGES.sections;

export function CustomProductsSection({ rows }: CustomProductsSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold text-foreground">{strings.customTitle}</h2>
        <p className="text-sm text-foreground/50">{strings.customSubtitle}</p>
      </div>
      <InventoryReportTable rows={rows} emptyMessage={strings.customEmpty} />
    </div>
  );
}

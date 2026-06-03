import Link from 'next/link';
import { ProductInventoryReport } from '@/features/product-inventory-report/components/ProductInventoryReport';
import { INVENTORY_REPORT_MESSAGES } from '@/features/product-inventory-report/constants/messages';

const strings = INVENTORY_REPORT_MESSAGES;

export default function ProductInventoryReportPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Link
          href="/products"
          className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          {strings.page.backButton}
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        <p className="text-sm text-foreground/60">{strings.page.subtitle}</p>
      </div>

      <ProductInventoryReport />
    </div>
  );
}

'use client';

import { StatusDot } from '@/components/ui/StatusDot';
import type { Product } from '@/features/products/types/products.types';
import type { AlertSeverity } from '../types/stock-alert.types';
import { buildProductAlerts } from '../shared/utils';
import { STOCK_ALERTS_MESSAGES } from '../constants/messages';

const strings = STOCK_ALERTS_MESSAGES;

interface ProductAlertsProps {
  products: Product[];
  onAdjust: (product: Product) => void;
}

interface AlertRowProps {
  product: Product;
  severity: AlertSeverity;
  onAdjust: (product: Product) => void;
}

function AlertRow({ product, severity, onAdjust }: AlertRowProps) {
  const isOut = severity === 'out_of_stock';
  const avgLabel =
    product.avgDailySales != null
      ? `${product.avgDailySales.toFixed(2)} ${strings.unitsLabel}/día`
      : strings.daysRemainingUnknown;
  const daysLabel =
    product.daysRemaining != null
      ? `${product.daysRemaining} días`
      : strings.daysRemainingUnknown;

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isOut ? 'text-destructive' : 'text-warning-foreground'}`}>
          {product.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-destructive/80' : 'text-warning-foreground/80'}`}>
          {strings.stockLabel}: {product.currentStock} {strings.unitsLabel} ·{' '}
          {strings.thresholdLabel}: {product.minThreshold}
        </p>
        <p className={`text-xs mt-0.5 ${isOut ? 'text-destructive/70' : 'text-warning-foreground/70'}`}>
          {strings.avgDailySalesLabel}: {avgLabel} · {strings.daysRemainingLabel}: {daysLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAdjust(product)}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-destructive/40 text-destructive hover:bg-destructive/15'
            : 'border-warning/50 text-warning-foreground hover:bg-warning/20'
        }`}
      >
        {strings.adjustButton}
      </button>
    </li>
  );
}

export function ProductAlerts({ products, onAdjust }: ProductAlertsProps) {
  const alerts = buildProductAlerts(products);
  const outOfStock = alerts.filter((a) => a.severity === 'out_of_stock');
  const lowStock = alerts.filter((a) => a.severity === 'low_stock');

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {outOfStock.length > 0 && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/15 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <StatusDot tone="danger" />
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
                {strings.outOfStock} ({outOfStock.length})
              </p>
            </div>
            <ul className="space-y-3">
              {outOfStock.map(({ product }) => (
                <AlertRow
                  key={product.id}
                  product={product}
                  severity="out_of_stock"
                  onAdjust={onAdjust}
                />
              ))}
            </ul>
          </div>
        )}

        {lowStock.length > 0 && (
          <div className="rounded-lg border border-warning/30 bg-warning/20 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <StatusDot tone="warning" />
              <p className="text-xs font-semibold uppercase tracking-wide text-warning-foreground">
                {strings.lowStock} ({lowStock.length})
              </p>
            </div>
            <ul className="space-y-3">
              {lowStock.map(({ product }) => (
                <AlertRow
                  key={product.id}
                  product={product}
                  severity="low_stock"
                  onAdjust={onAdjust}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

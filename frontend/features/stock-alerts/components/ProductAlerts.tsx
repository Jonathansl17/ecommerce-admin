'use client';

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

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${isOut ? 'text-red-800' : 'text-yellow-900'}`}>
          {product.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-red-500' : 'text-yellow-600'}`}>
          {strings.stockLabel}: {product.currentStock} {strings.unitsLabel} ·{' '}
          {strings.thresholdLabel}: {product.minThreshold}
        </p>
      </div>
      <button
        onClick={() => onAdjust(product)}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-red-300 text-red-700 hover:bg-red-100'
            : 'border-yellow-400 text-yellow-800 hover:bg-yellow-100'
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
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
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
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
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

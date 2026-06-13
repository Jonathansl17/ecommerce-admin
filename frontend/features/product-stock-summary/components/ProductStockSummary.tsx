'use client';

import Link from 'next/link';
import { StatusDot } from '@/components/ui/StatusDot';
import type { StockSummaryItem } from '../types/product-stock-summary.types';
import type { AlertSeverity } from '@/features/stock-alerts/types/stock-alert.types';
import { useProductStockSummary } from '../hooks/useProductStockSummary';
import { partitionStockItems } from '../shared/utils';
import { STOCK_SUMMARY_MESSAGES } from '../constants/messages';
import { STOCK_SUMMARY_ROUTES as ROUTES } from '../constants/api';

const strings = STOCK_SUMMARY_MESSAGES;

interface SummaryRowProps {
  item: StockSummaryItem;
  severity: AlertSeverity;
}

function SummaryRow({ item, severity }: SummaryRowProps) {
  const isOut = severity === 'out_of_stock';

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${isOut ? 'text-destructive' : 'text-warning-foreground'}`}>
          {item.product.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-destructive/80' : 'text-warning-foreground/80'}`}>
          {strings.stockLabel}: {item.product.currentStock} {strings.unitsLabel} ·{' '}
          {strings.thresholdLabel}: {item.product.minThreshold}
        </p>
      </div>
      <Link
        href={ROUTES.PRODUCTS}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-destructive/40 text-destructive hover:bg-destructive/15'
            : 'border-warning/50 text-warning-foreground hover:bg-warning/20'
        }`}
      >
        {strings.adjustLink}
      </Link>
    </li>
  );
}

export function ProductStockSummary() {
  const { items, isLoading, error, outOfStockCount, lowStockCount, refresh } =
    useProductStockSummary();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>
        <p className="text-sm text-muted-foreground">{strings.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={refresh}
          className="text-sm text-foreground/60 underline hover:text-foreground"
        >
          {strings.retry}
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>
        <p className="text-sm text-muted-foreground">{strings.noAlerts}</p>
      </div>
    );
  }

  const { outOfStock, lowStock } = partitionStockItems(items);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>
        <div className="flex items-center gap-3">
          {outOfStockCount > 0 && (
            <span className="text-xs font-medium text-destructive">
              {outOfStockCount} {strings.outOfStock.toLowerCase()}
            </span>
          )}
          {lowStockCount > 0 && (
            <span className="text-xs font-medium text-warning-foreground">
              {lowStockCount} {strings.lowStock.toLowerCase()}
            </span>
          )}
          <Link
            href={ROUTES.PRODUCTS}
            className="text-xs text-foreground/50 underline hover:text-foreground"
          >
            {strings.viewAllLink}
          </Link>
        </div>
      </div>

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
              {outOfStock.map(({ product, severity }) => (
                <SummaryRow key={product.id} item={{ product, severity }} severity={severity} />
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
              {lowStock.map(({ product, severity }) => (
                <SummaryRow key={product.id} item={{ product, severity }} severity={severity} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

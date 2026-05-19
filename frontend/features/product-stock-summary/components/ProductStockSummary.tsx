'use client';

import Link from 'next/link';
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
        <p className={`truncate text-sm font-medium ${isOut ? 'text-red-800' : 'text-yellow-900'}`}>
          {item.product.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-red-500' : 'text-yellow-600'}`}>
          {strings.stockLabel}: {item.product.currentStock} {strings.unitsLabel} ·{' '}
          {strings.thresholdLabel}: {item.product.minThreshold}
        </p>
      </div>
      <Link
        href={ROUTES.PRODUCTS}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-red-300 text-red-700 hover:bg-red-100'
            : 'border-yellow-400 text-yellow-800 hover:bg-yellow-100'
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
        <p className="text-sm text-red-500">{error}</p>
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
            <span className="text-xs font-medium text-red-600">
              {outOfStockCount} {strings.outOfStock.toLowerCase()}
            </span>
          )}
          {lowStockCount > 0 && (
            <span className="text-xs font-medium text-yellow-700">
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
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
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
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
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

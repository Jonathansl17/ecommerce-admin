import { Fragment } from 'react';
import { Palette } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { CUSTOM_ORDER_CARD_STRINGS as strings } from '../constants/customOrders.constants';
import type { CustomOrderProductListProps } from '../types/customOrders.types';

export function CustomOrderProductList({ products }: CustomOrderProductListProps) {
  return (
    <ul className="mt-3 space-y-2" aria-label={strings.productsLabel}>
      {products.map((product, index) => {
        const details =
          product.isCustomizable && product.customizationDetails
            ? Object.entries(product.customizationDetails)
            : [];

        return (
          <li key={index} className={index > 0 ? 'border-t border-border pt-2' : ''}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-foreground">
                <span className="font-medium tabular-nums">{product.quantity}</span>
                {' '}
                {product.name}
              </span>
              {!product.isCustomizable && (
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatCurrency(product.unitPrice)} {strings.unitPrice}
                </span>
              )}
            </div>

            {details.length > 0 && (
              <div className="mt-2 border-l-2 border-amber-400 pl-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                  <Palette className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {strings.customizationSectionLabel}
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                  {details.map(([key, value]) => (
                    <Fragment key={key}>
                      <dt className="whitespace-nowrap text-xs font-medium capitalize text-muted-foreground">{key}</dt>
                      <dd className="text-xs text-foreground">{value}</dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

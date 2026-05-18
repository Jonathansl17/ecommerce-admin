'use client';

import Image from 'next/image';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import { formatCurrency } from '../utils/orders-format.utils';
import type { AdminOrderItem } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

interface OrderItemsListProps {
  items: AdminOrderItem[] | undefined;
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const list = items ?? [];
  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">{s.noItems}</p>;
  }

  return (
    <ul className="space-y-3">
      {list.map((item) => {
        const productName = item.variant.product.item?.name ?? s.unknownProduct;
        const imageUrl = item.variant.product.imageUrl;
        const lineTotal = item.quantity * item.unitPriceSnap;

        return (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/40"
          >
            {imageUrl ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={imageUrl}
                  alt={productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground">
                {s.unknownProduct}
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-sm font-semibold text-foreground">
                {productName}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.variant.color && (
                  <span>
                    {s.colorLabel}: {item.variant.color}
                  </span>
                )}
                {item.variant.color && item.variant.size && ' · '}
                {item.variant.size && (
                  <span>
                    {s.sizeLabel}: {item.variant.size}
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {s.colQty}: <span className="font-medium text-foreground">{item.quantity}</span>
                <span className="mx-2">·</span>
                {s.colUnitPrice}: <span className="font-medium text-foreground">{formatCurrency(item.unitPriceSnap)}</span>
              </span>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.colLineTotal}
              </p>
              <p className="mt-1 text-base font-bold text-foreground">
                {formatCurrency(lineTotal)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

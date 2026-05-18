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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colItem}
            </th>
            <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colQty}
            </th>
            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colUnitPrice}
            </th>
            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colLineTotal}
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            const productName = item.variant.product.item?.name ?? s.unknownProduct;
            const imageUrl = item.variant.product.imageUrl;
            const lineTotal = item.quantity * item.unitPriceSnap;

            return (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {imageUrl ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <Image
                          src={imageUrl}
                          alt={productName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-md border border-border bg-muted" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{productName}</span>
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
                    </div>
                  </div>
                </td>
                <td className="py-3 text-center text-foreground">{item.quantity}</td>
                <td className="py-3 text-right text-foreground">
                  {formatCurrency(item.unitPriceSnap)}
                </td>
                <td className="py-3 text-right font-medium text-foreground">
                  {formatCurrency(lineTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

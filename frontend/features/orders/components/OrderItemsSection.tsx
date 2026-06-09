import { OrderItemsList } from './OrderItemsList';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderItemsSectionProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.sectionItems}
      </h2>
      <OrderItemsList items={items} />
    </section>
  );
}

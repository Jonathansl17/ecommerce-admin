import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderShippingAddressProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderShippingAddress({ address }: OrderShippingAddressProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.sectionShipping}
      </h2>
      <p className="text-sm text-foreground">{address}</p>
    </section>
  );
}

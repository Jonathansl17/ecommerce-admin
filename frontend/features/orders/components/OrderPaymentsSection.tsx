import { OrderPaymentsList } from './OrderPaymentsList';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderPaymentsSectionProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderPaymentsSection({ payments }: OrderPaymentsSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.sectionPayments}
      </h2>
      <OrderPaymentsList payments={payments} />
    </section>
  );
}

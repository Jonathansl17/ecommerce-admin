import Link from 'next/link';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderDetailErrorProps } from '../types/orders.types';

const { detail: s, errors } = ORDERS_STRINGS;

export function OrderDetailError({ error }: OrderDetailErrorProps) {
  return (
    <main className="p-6">
      <Link
        href="/sales"
        className="mb-4 inline-flex text-sm text-muted-foreground hover:text-foreground"
      >
        ← {s.backToList}
      </Link>
      <div
        className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-sm text-destructive"
        role="alert"
      >
        {error ?? errors.fetchDetail}
      </div>
    </main>
  );
}

import { ORDERS_STRINGS } from '../constants/orders.constants';

const { detail: s } = ORDERS_STRINGS;

export function OrderDetailLoading() {
  return (
    <main className="p-6" aria-live="polite" aria-busy>
      <p className="text-sm text-muted-foreground">{s.loading}</p>
    </main>
  );
}

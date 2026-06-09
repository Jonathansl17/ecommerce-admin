import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderClientInfoProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderClientInfo({ clientUser }: OrderClientInfoProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.sectionClient}
      </h2>
      {clientUser ? (
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">{s.labelClientName}</dt>
            <dd className="font-medium text-foreground">{clientUser.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{s.labelClientEmail}</dt>
            <dd className="text-foreground">{clientUser.email}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">{s.noClient}</p>
      )}
    </section>
  );
}

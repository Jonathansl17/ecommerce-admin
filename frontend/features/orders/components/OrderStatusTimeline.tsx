import { OrderStatusBadge } from './OrderStatusBadge';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import { formatDate } from '../utils/orders-format.utils';
import type { OrderStatusTimelineProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderStatusTimeline({ notifications }: OrderStatusTimelineProps) {
  if (notifications.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {s.sectionTimeline}
      </h2>
      <ol className="relative space-y-4 border-l border-border pl-5">
        {notifications.map((notification, index) => (
          <li key={notification.id} className="relative">
            <span
              className="absolute -left-[1.4rem] top-1 flex h-3 w-3 items-center justify-center"
              aria-hidden="true"
            >
              <span
                className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}
              />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={notification.status} />
              <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

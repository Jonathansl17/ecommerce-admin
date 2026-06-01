'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { useCustomOrders } from '@/features/custom-orders/hooks/useCustomOrders';
import { CustomOrderCard } from '@/features/custom-orders/components/CustomOrderCard';
import { CUSTOM_ORDERS_STRINGS } from '@/features/custom-orders/constants/customOrders.constants';

const strings = CUSTOM_ORDERS_STRINGS;

const SKELETON_COUNT = 3;

const STATUS = { ACCEPTED: 'accepted', REJECTED: 'rejected' } as const;

type StatusFilter = 'pending' | 'accepted' | 'all';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'pending', label: strings.page.filterPending },
  { key: 'accepted', label: strings.page.filterAccepted },
  { key: 'all', label: strings.page.filterAll },
];

export default function CustomOrdersPage() {
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams.get('order');

  const { orders, isLoading, isError, pendingCount, updateStatus, refetch } = useCustomOrders();
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const highlightRef = useRef<HTMLLIElement | null>(null);

  const acceptedCount = orders.filter((o) => o.content.customizationStatus === 'accepted').length;

  // When arriving from a notification link, switch to the right tab and scroll
  useEffect(() => {
    if (!highlightOrderId || orders.length === 0) return;
    const target = orders.find((o) => o.content.orderId === highlightOrderId);
    if (!target) return;
    const status = target.content.customizationStatus;
    setFilter(status === STATUS.ACCEPTED ? 'accepted' : status === STATUS.REJECTED ? 'all' : 'pending');
  }, [highlightOrderId, orders]);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightOrderId]); // only scroll when the target changes

  const filtered =
    filter === 'pending'
      ? orders.filter((o) => !o.content.customizationStatus)
      : filter === 'accepted'
        ? orders.filter((o) => o.content.customizationStatus === 'accepted')
        : orders;

  const countFor = (key: StatusFilter) => {
    if (key === 'pending') return pendingCount;
    if (key === 'accepted') return acceptedCount;
    return orders.length;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>

      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label={strings.page.ariaTabList}
      >
        {FILTERS.map(({ key, label }) => {
          const count = countFor(key);
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(key)}
              className={[
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted-foreground/20 text-muted-foreground',
                ].join(' ')}
                aria-label={
                  key === 'pending'
                    ? strings.page.ariaPendingCount(count)
                    : key === 'accepted'
                      ? strings.page.ariaAcceptedCount(count)
                      : strings.page.ariaAllCount(count)
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="max-w-2xl">
        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Cargando pedidos personalizados">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border border-border border-l-4 border-l-amber-300 bg-muted"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">{strings.errors.fetchError}</p>
            <p className="text-xs text-muted-foreground">{strings.errors.fetchErrorSubtitle}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-1 rounded-md border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {strings.errors.retryLabel}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">
              {filter === 'pending' ? strings.empty.pending : strings.empty.all}
            </p>
            <p className="text-xs text-muted-foreground">
              {filter === 'pending' ? strings.empty.pendingSubtitle : strings.empty.allSubtitle}
            </p>
          </div>
        ) : (
          <ul className="space-y-3" aria-label={strings.page.ariaOrderList}>
            {filtered.map((order) => {
              const isHighlighted = order.content.orderId === highlightOrderId;
              return (
                <li
                  key={order.notification.id}
                  ref={isHighlighted ? highlightRef : null}
                  className={isHighlighted ? 'ring-2 ring-amber-400 ring-offset-2 rounded-lg' : ''}
                >
                  <CustomOrderCard order={order} onStatusUpdate={updateStatus} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

'use client';

import { use } from 'react';
import Link from 'next/link';
import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail';
import { useOrderMutations } from '@/features/orders/hooks/useOrderMutations';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { OrderStatusChanger } from '@/features/orders/components/OrderStatusChanger';
import { CancelOrderButton } from '@/features/orders/components/CancelOrderButton';
import { OrderItemsList } from '@/features/orders/components/OrderItemsList';
import { OrderPaymentsList } from '@/features/orders/components/OrderPaymentsList';
import { ORDERS_STRINGS } from '@/features/orders/constants/orders.constants';
import { formatDate, shortId } from '@/features/orders/utils/orders-format.utils';
import { formatCurrency } from '@/features/orders/utils/orders-format.utils';
import type { OrderStatus } from '@/features/orders/types/orders.types';

const { detail: s, page: pageStrings } = ORDERS_STRINGS;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { pedido, cargando, error, setPedido } = useOrderDetail(id);
  const { ejecutando, error: mutationError, actualizarEstado, cancelar } = useOrderMutations();

  const handleStatusChange = async (status: OrderStatus) => {
    const updated = await actualizarEstado(id, status);
    if (updated) setPedido(updated);
  };

  const handleCancel = async () => {
    const cancelled = await cancelar(id);
    if (cancelled) setPedido(cancelled);
  };

  if (cargando) {
    return (
      <main className="p-6" aria-live="polite" aria-busy>
        <p className="text-sm text-muted-foreground">Cargando pedido...</p>
      </main>
    );
  }

  if (error || !pedido) {
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
          {error ?? ORDERS_STRINGS.errors.fetchDetail}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      {/* Back */}
      <Link
        href="/sales"
        className="inline-flex w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← {s.backToList}
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{pageStrings.title}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{pedido.id}</p>
      </div>

      {/* Order header card */}
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Summary */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={pedido.status} />
              <span className="text-sm text-muted-foreground">
                {formatDate(pedido.createdAt)}
              </span>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex gap-1">
                <dt className="text-muted-foreground">Subtotal:</dt>
                <dd className="font-medium text-foreground">{formatCurrency(pedido.subtotal)}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-muted-foreground">Impuestos:</dt>
                <dd className="font-medium text-foreground">{formatCurrency(pedido.taxes)}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-muted-foreground">Total:</dt>
                <dd className="text-base font-bold text-foreground">
                  {formatCurrency(pedido.totalAmount)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-end gap-3">
            <OrderStatusChanger
              currentStatus={pedido.status}
              disabled={ejecutando}
              onChange={handleStatusChange}
            />
            <CancelOrderButton
              currentStatus={pedido.status}
              disabled={ejecutando}
              onCancel={handleCancel}
            />
          </div>
        </div>

        {mutationError && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {mutationError}
          </p>
        )}
      </section>

      {/* Client info */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {s.sectionClient}
        </h2>
        {pedido.clientUser ? (
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Nombre</dt>
              <dd className="font-medium text-foreground">{pedido.clientUser.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="text-foreground">{pedido.clientUser.email}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">{s.noClient}</p>
        )}
      </section>

      {/* Shipping address */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {s.sectionShipping}
        </h2>
        <p className="text-sm text-foreground">{pedido.shippingAddress}</p>
      </section>

      {/* Items */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {s.sectionItems}
        </h2>
        <OrderItemsList items={pedido.orderItems} />
      </section>

      {/* Payments */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {s.sectionPayments}
        </h2>
        <OrderPaymentsList payments={pedido.payments} />
      </section>

      {/* Status timeline */}
      {(pedido.orderStatusNotifications ?? []).length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {s.sectionTimeline}
          </h2>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {(pedido.orderStatusNotifications ?? []).map((notification, index) => (
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
                  <span className="text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

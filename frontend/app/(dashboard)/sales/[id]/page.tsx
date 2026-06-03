'use client';

import { use } from 'react';
import Link from 'next/link';
import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail';
import { useOrderMutations } from '@/features/orders/hooks/useOrderMutations';
import { OrderDetailLoading } from '@/features/orders/components/OrderDetailLoading';
import { OrderDetailError } from '@/features/orders/components/OrderDetailError';
import { OrderDetailHeader } from '@/features/orders/components/OrderDetailHeader';
import { OrderClientInfo } from '@/features/orders/components/OrderClientInfo';
import { OrderShippingAddress } from '@/features/orders/components/OrderShippingAddress';
import { OrderItemsSection } from '@/features/orders/components/OrderItemsSection';
import { OrderPaymentsSection } from '@/features/orders/components/OrderPaymentsSection';
import { OrderStatusTimeline } from '@/features/orders/components/OrderStatusTimeline';
import { ORDERS_STRINGS } from '@/features/orders/constants/orders.constants';
import type { OrderStatus } from '@/features/orders/types/orders.types';

const { detail: s, page: pageStrings } = ORDERS_STRINGS;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { pedido, cargando, error, recargar } = useOrderDetail(id);
  const { ejecutando, error: mutationError, actualizarEstado, cancelar, aprobarPago } = useOrderMutations();

  const handleStatusChange = async (status: OrderStatus) => {
    const updated = await actualizarEstado(id, status);
    if (updated) recargar();
  };

  const handleCancel = async () => {
    const cancelled = await cancelar(id);
    if (cancelled) recargar();
  };

  const handleApprovePayment = async () => {
    const payment = pedido?.payments[0];
    if (!payment) return;
    const ok = await aprobarPago(id, payment.id);
    if (ok) recargar();
  };

  if (cargando) return <OrderDetailLoading />;
  if (error || !pedido) return <OrderDetailError error={error} />;

  return (
    <main className="flex flex-col gap-6 p-6">
      <Link
        href="/sales"
        className="inline-flex w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← {s.backToList}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{pageStrings.title}</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{pedido.id}</p>
      </div>

      <OrderDetailHeader
        pedido={pedido}
        ejecutando={ejecutando}
        mutationError={mutationError}
        onStatusChange={handleStatusChange}
        onCancel={handleCancel}
        onApprovePayment={handleApprovePayment}
      />

      <OrderClientInfo clientUser={pedido.clientUser} />
      <OrderShippingAddress address={pedido.shippingAddress} />
      <OrderItemsSection items={pedido.orderItems} />
      <OrderPaymentsSection payments={pedido.payments} />
      <OrderStatusTimeline notifications={pedido.orderStatusNotifications ?? []} />
    </main>
  );
}

import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderStatusChanger } from './OrderStatusChanger';
import { ApprovePaymentButton } from './ApprovePaymentButton';
import { CancelOrderButton } from './CancelOrderButton';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import { formatDate, formatCurrency } from '../utils/orders-format.utils';
import type { OrderDetailHeaderProps } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

export function OrderDetailHeader({
  pedido,
  ejecutando,
  mutationError,
  onStatusChange,
  onCancel,
  onApprovePayment,
}: OrderDetailHeaderProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={pedido.status} />
            <span className="text-sm text-muted-foreground">{formatDate(pedido.createdAt)}</span>
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-1">
              <dt className="text-muted-foreground">{s.labelSubtotal}</dt>
              <dd className="font-medium text-foreground">{formatCurrency(pedido.subtotal)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="text-muted-foreground">{s.labelTaxes}</dt>
              <dd className="font-medium text-foreground">{formatCurrency(pedido.taxes)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="text-muted-foreground">{s.labelTotal}</dt>
              <dd className="text-base font-bold text-foreground">{formatCurrency(pedido.totalAmount)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <OrderStatusChanger
            currentStatus={pedido.status}
            disabled={ejecutando}
            onChange={onStatusChange}
          />
          {pedido.payments[0] && (
            <ApprovePaymentButton
              currentStatus={pedido.status}
              paymentStatus={pedido.payments[0].status}
              disabled={ejecutando}
              onApprove={onApprovePayment}
            />
          )}
          <CancelOrderButton
            currentStatus={pedido.status}
            disabled={ejecutando}
            onCancel={onCancel}
          />
        </div>
      </div>

      {mutationError && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {mutationError}
        </p>
      )}
    </section>
  );
}

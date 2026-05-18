'use client';

import { ORDERS_STRINGS } from '../constants/orders.constants';
import { formatCurrency, formatDate } from '../utils/orders-format.utils';
import type { AdminOrderPayment } from '../types/orders.types';

const { detail: s } = ORDERS_STRINGS;

interface OrderPaymentsListProps {
  payments: AdminOrderPayment[];
}

export function OrderPaymentsList({ payments }: OrderPaymentsListProps) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">{s.noPayments}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colPaymentMethod}
            </th>
            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colPaymentAmount}
            </th>
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colPaymentStatus}
            </th>
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colPaymentRef}
            </th>
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colPaymentDate}
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-border last:border-0">
              <td className="py-3 pr-4 text-foreground">{payment.method}</td>
              <td className="py-3 pr-4 text-right font-medium text-foreground">
                {formatCurrency(payment.amount)}
              </td>
              <td className="py-3 pr-4 text-foreground">{payment.status}</td>
              <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                {payment.externalReference ?? '—'}
              </td>
              <td className="py-3 text-muted-foreground">{formatDate(payment.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

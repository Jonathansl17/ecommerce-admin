'use client';

import Link from 'next/link';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import { formatCurrency, formatDate, shortId } from '../utils/orders-format.utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { AdminOrder } from '../types/orders.types';

const { table: s } = ORDERS_STRINGS;

interface OrdersTableProps {
  pedidos: AdminOrder[];
}

export function OrdersTable({ pedidos }: OrdersTableProps) {
  if (pedidos.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{s.emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colId}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colDate}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colClient}
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colTotal}
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colStatus}
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.colActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border last:border-0 transition-colors hover:bg-accent/40"
            >
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {shortId(order.id)}
              </td>
              <td className="px-4 py-3 text-foreground">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 text-foreground">
                {order.clientUser ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{order.clientUser.fullName}</span>
                    <span className="text-xs text-muted-foreground">{order.clientUser.email}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-medium text-foreground">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/sales/${order.id}`}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  {s.viewDetail}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

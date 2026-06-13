'use client';

import { Check, X, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, timeAgo } from '@/lib/utils/format';
import { CUSTOM_ORDER_CARD_STRINGS as strings, BORDER_COLOR_CLASSES } from '../constants/customOrders.constants';
import { CustomOrderProductList } from './CustomOrderProductList';
import { CustomOrderActions } from './CustomOrderActions';
import type { CustomOrderCardProps } from '../types/customOrders.types';

export function CustomOrderCard({ order, onStatusUpdate }: CustomOrderCardProps) {
  const { notification, content } = order;
  const {
    orderId,
    clientName,
    clientEmail,
    products,
    total,
    shippingAddress,
    customizationStatus,
    customizationRejectionReason,
  } = content;

  const isPending = !customizationStatus;
  const isAccepted = customizationStatus === 'accepted';
  const borderStatus = isPending ? 'pending' : isAccepted ? 'accepted' : 'rejected';

  return (
    <article
      className={`rounded-lg border border-border border-l-4 ${BORDER_COLOR_CLASSES[borderStatus]} bg-card p-4 shadow-sm`}
      aria-label={`Pedido ${orderId} — ${clientName}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {strings.orderIdLabel} #{orderId}
          </p>
          <p className="mt-0.5 truncate text-base font-semibold text-foreground">{clientName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <time dateTime={notification.createdAt} className="text-xs text-muted-foreground">
            {timeAgo(notification.createdAt)}
          </time>
          {isAccepted && (
            <Badge variant="success">
              <Check className="h-3 w-3" aria-hidden="true" />
              {strings.statusAccepted}
            </Badge>
          )}
          {customizationStatus === 'rejected' && (
            <Badge variant="danger">
              <X className="h-3 w-3" aria-hidden="true" />
              {strings.statusRejected}
            </Badge>
          )}
        </div>
      </div>

      <CustomOrderProductList products={products} />

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-medium text-muted-foreground">{strings.budgetLabel}</span>
        <span className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(total)}</span>
      </div>

      <div className="mt-2 flex items-start gap-1.5">
        <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">{shippingAddress}</p>
      </div>

      {customizationStatus === 'rejected' && customizationRejectionReason && (
        <p className="mt-2 text-xs italic text-muted-foreground border-t border-border pt-2">
          {customizationRejectionReason}
        </p>
      )}

      <CustomOrderActions
        notificationId={notification.id}
        orderId={orderId}
        isPending={isPending}
        isAccepted={isAccepted}
        clientEmail={clientEmail}
        onStatusUpdate={onStatusUpdate}
      />
    </article>
  );
}

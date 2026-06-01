'use client';

import { Fragment, useState } from 'react';
import { MapPin, Check, X, Palette, Mail } from 'lucide-react';
import type { CustomOrder } from '../hooks/useCustomOrders';
import { CUSTOM_ORDERS_STRINGS } from '../constants/customOrders.constants';
import { formatCurrency, timeAgo } from '@/lib/utils/format';

const strings = CUSTOM_ORDERS_STRINGS.card;

interface CustomOrderCardProps {
  order: CustomOrder;
  onStatusUpdate: (id: string, status: 'accepted' | 'rejected', reason?: string) => Promise<void>;
}

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

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = !customizationStatus;
  const isAccepted = customizationStatus === 'accepted';

  // Left border: amber for pending, green for accepted, red for rejected
  const borderColorClass = isPending
    ? 'border-l-amber-400'
    : isAccepted
      ? 'border-l-green-500'
      : 'border-l-red-500';

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await onStatusUpdate(notification.id, 'accepted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onStatusUpdate(notification.id, 'rejected', rejectionReason.trim() || undefined);
      setIsRejecting(false);
      setRejectionReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setIsRejecting(false);
    setRejectionReason('');
  };

  return (
    <article
      className={`rounded-lg border border-border border-l-4 ${borderColorClass} bg-card p-4 shadow-sm`}
      aria-label={`Pedido ${orderId} — ${clientName}`}
    >
      {/* Header */}
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
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              <Check className="h-3 w-3" aria-hidden="true" />
              {strings.statusAccepted}
            </span>
          )}
          {customizationStatus === 'rejected' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
              <X className="h-3 w-3" aria-hidden="true" />
              {strings.statusRejected}
            </span>
          )}
        </div>
      </div>

      {/* Product list */}
      <ul className="mt-3 space-y-2" aria-label={strings.productsLabel}>
        {products.map((product, index) => {
          const details =
            product.isCustomizable && product.customizationDetails
              ? Object.entries(product.customizationDetails)
              : [];

          return (
            <li key={index} className={index > 0 ? 'border-t border-border pt-2' : ''}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-sm text-foreground">
                  <span className="font-medium tabular-nums">{product.quantity}</span>
                  {' '}
                  {product.name}
                </span>
                {!product.isCustomizable && (
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatCurrency(product.unitPrice)} {strings.unitPrice}
                  </span>
                )}
              </div>

              {details.length > 0 && (
                <div className="mt-2 border-l-2 border-amber-400 pl-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                    <Palette className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {strings.customizationSectionLabel}
                  </p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                    {details.map(([key, value]) => (
                      <Fragment key={key}>
                        <dt className="whitespace-nowrap text-xs font-medium capitalize text-muted-foreground">{key}</dt>
                        <dd className="text-xs text-foreground">{value}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Total */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-medium text-muted-foreground">{strings.budgetLabel}</span>
        <span className="text-sm font-bold tabular-nums text-foreground">{formatCurrency(total)}</span>
      </div>

      {/* Shipping address */}
      <div className="mt-2 flex items-start gap-1.5">
        <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">{shippingAddress}</p>
      </div>

      {/* Rejection reason when resolved */}
      {customizationStatus === 'rejected' && customizationRejectionReason && (
        <p className="mt-2 text-xs italic text-muted-foreground border-t border-border pt-2">
          {customizationRejectionReason}
        </p>
      )}

      {/* Actions — bottom left when pending */}
      {isPending && !isRejecting && (
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={handleAccept}
            disabled={isSubmitting}
            aria-label={strings.ariaAccept(orderId)}
            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1"
          >
            {strings.actionAccept}
          </button>
          <button
            type="button"
            onClick={() => setIsRejecting(true)}
            disabled={isSubmitting}
            aria-label={strings.ariaReject(orderId)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            {strings.actionReject}
          </button>
        </div>
      )}

      {/* Contact button — only when accepted */}
      {isAccepted && clientEmail && (
        <div className="mt-3 flex justify-end border-t border-border pt-3">
          <a
            href={`mailto:${clientEmail}?subject=${strings.contactSubject(orderId)}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {strings.contactLabel}
          </a>
        </div>
      )}

      {/* Rejection form — full width, shown at bottom when rejecting */}
      {isPending && isRejecting && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={strings.rejectionPlaceholder}
            rows={2}
            disabled={isSubmitting}
            aria-label={strings.rejectionReasonLabel}
            className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRejectConfirm}
              disabled={isSubmitting}
              aria-label={strings.ariaConfirmReject}
              className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1"
            >
              {isSubmitting ? strings.loadingLabel : strings.actionConfirmReject}
            </button>
            <button
              type="button"
              onClick={handleRejectCancel}
              disabled={isSubmitting}
              aria-label={strings.ariaCancelReject}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              {strings.actionCancelReject}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

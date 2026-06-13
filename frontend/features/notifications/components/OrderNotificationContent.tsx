import Link from 'next/link';
import { MapPin, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type {
  OrderNotificationContent as OrderContent,
  OrderNotificationContentProps,
} from '../types/notifications.types';
import { NOTIFICATION_ORDER_STRINGS as strings, ROUTES } from '../constants/notifications.constants';
import { formatCurrency } from '@/lib/utils/format';

export function OrderNotificationContent({ content }: OrderNotificationContentProps) {
  const {
    orderId,
    clientName,
    products,
    total,
    shippingAddress,
    hasCustomization,
    customizationStatus,
    customizationRejectionReason,
  } = content;

  if (hasCustomization) {
    return (
      <div className="mt-2 space-y-2 text-sm">
        {/* Identity */}
        <div className="space-y-0.5">
          {orderId && <p className="text-xs font-medium text-foreground/60">#{orderId}</p>}
          <p className="font-semibold text-foreground text-sm">{clientName}</p>
        </div>

        {/* Products */}
        <ul className="space-y-0.5">
          {products.map((product, index) => (
            <li key={index} className="text-sm text-foreground">
              {product.quantity} {product.name}
            </li>
          ))}
        </ul>

        {/* Customization resolved: accepted / rejected */}
        {customizationStatus && (
          <div className="border-t border-border pt-2">
            {customizationStatus === 'accepted' ? (
              <Badge variant="success">
                <Check className="h-3 w-3" aria-hidden="true" />
                {strings.customizationAccepted}
              </Badge>
            ) : (
              <>
                <Badge variant="danger">
                  <X className="h-3 w-3" aria-hidden="true" />
                  {strings.customizationRejected}
                </Badge>
                {customizationRejectionReason && (
                  <p className="mt-1 text-xs italic text-muted-foreground">{customizationRejectionReason}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Pending customization: action button */}
        {!customizationStatus && (
          <div className="border-t border-border pt-2" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`${ROUTES.CUSTOM_ORDERS}${orderId ? `?order=${orderId}` : ''}`}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {strings.viewDetailsText}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2.5 text-sm">
      <ul className="space-y-1.5">
        {products.map((product, index) => (
          <li key={index} className="flex items-baseline justify-between gap-3">
            <span className="truncate text-foreground">
              {product.quantity} {product.name}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatCurrency(product.unitPrice)} {strings.unitPrice}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="text-xs font-medium text-muted-foreground">{strings.totalLabel}</span>
        <span className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(total)}</span>
      </div>

      <div className="space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">{strings.shippingLabel}</p>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">{shippingAddress}</p>
        </div>
      </div>
    </div>
  );
}

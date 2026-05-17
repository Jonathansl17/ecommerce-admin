import type { OrderNotificationContent as OrderContent } from '../types/notifications.types';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.order;

interface OrderNotificationContentProps {
  content: OrderContent;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function OrderNotificationContent({ content }: OrderNotificationContentProps) {
  const { products, total, shippingAddress, hasCustomization } = content;

  return (
    <div className="mt-2 space-y-3 text-sm">
      {hasCustomization && (
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
          role="alert"
        >
          <span aria-hidden="true">&#9888;</span>
          <span className="font-medium">{strings.customizationBanner}</span>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
          {strings.productsLabel}
        </p>
        <ul className="space-y-1">
          {products.map((product, index) => (
            <li key={index} className="flex items-start justify-between gap-2">
              <span className="text-foreground">
                {product.quantity}x {product.name}
                {product.isCustomizable && (
                  <span
                    className="ml-1 inline-block rounded px-1 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                  >
                    {strings.customizationBadge}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {formatCurrency(product.unitPrice)} {strings.unitPrice}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="font-semibold text-foreground">{strings.totalLabel}</span>
        <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
          {strings.shippingLabel}
        </p>
        <p className="text-foreground">{shippingAddress}</p>
      </div>
    </div>
  );
}

import { Bell } from 'lucide-react';
import type { ToastItemProps } from '../types/notifications.types';
import { NOTIFICATION_TOAST_STRINGS as strings } from '../constants/notifications.constants';
import { formatCurrency } from '@/lib/utils/format';

function renderStarsText(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function NotificationToastItem({ toast, onDismiss }: ToastItemProps) {
  const { notification, orderContent, reviewContent } = toast;
  const isReview = reviewContent !== null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto w-80 rounded-lg border border-border bg-card shadow-lg"
    >
      <div className="flex items-start justify-between gap-2 p-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground truncate">
            {isReview ? strings.newReview : strings.newOrder}
          </p>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Cerrar notificación"
        >
          <span className="block h-4 w-4 leading-none text-center" aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="px-3 pb-3 space-y-1">
        <p className="text-sm font-medium text-foreground">{notification.title}</p>

        {orderContent && (
          <>
            <p className="text-xs text-muted-foreground">
              {orderContent.clientName} &mdash; {formatCurrency(orderContent.total)}
            </p>
            {orderContent.hasCustomization && (
              <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                {strings.customizationBadge}
              </span>
            )}
          </>
        )}

        {reviewContent && (
          <>
            <p className="text-xs text-muted-foreground">{reviewContent.productName}</p>
            <p
              className="text-xs text-amber-500"
              aria-label={`${reviewContent.rating} de 5 estrellas`}
            >
              {renderStarsText(reviewContent.rating)}
            </p>
            {reviewContent.isPriority && (
              <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                {strings.priorityBadge}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

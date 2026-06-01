'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useSSENotifications } from '../hooks/useSSENotifications';
import { getUnreadCount } from '../shared/notifications.api';
import type {
  Notification,
  OrderNotificationContent,
  ReviewNotificationContent,
} from '../types/notifications.types';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.toast;

interface ToastNotification {
  id: string;
  notification: Notification;
  orderContent: OrderNotificationContent | null;
  reviewContent: ReviewNotificationContent | null;
}

function parseOrderContent(raw: string | null): OrderNotificationContent | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderNotificationContent;
  } catch {
    return null;
  }
}

function parseReviewContent(raw: string | null): ReviewNotificationContent | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ReviewNotificationContent;
  } catch {
    return null;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
  }).format(amount);
}

function renderStarsText(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function BadgeCount({ count }: { count: number }) {
  const label = count > 99 ? '99+' : String(count);
  return (
    <span
      className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white"
      aria-label={`${count} notificaciones sin leer`}
    >
      {label}
    </span>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}) {
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
          <span className="block h-4 w-4 leading-none text-center" aria-hidden="true">
            &times;
          </span>
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
              <span
                className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
              >
                {strings.customizationBadge}
              </span>
            )}
          </>
        )}

        {reviewContent && (
          <>
            <p className="text-xs text-muted-foreground">
              {reviewContent.productName}
            </p>
            <p
              className="text-xs"
              style={{ color: '#f59e0b' }}
              aria-label={`${reviewContent.rating} de 5 estrellas`}
            >
              {renderStarsText(reviewContent.rating)}
            </p>
            {reviewContent.isPriority && (
              <span
                className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
              >
                {strings.priorityBadge}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    getUnreadCount()
      .then((count) => setUnreadCount(count))
      .catch(() => {
        // non-fatal — bell renders without badge
      });
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const MAX_TOASTS = 3;

  const handleNewNotification = useCallback(
    (notification: Notification) => {
      setUnreadCount((prev) => prev + 1);

      const toastId = `${notification.id}-${Date.now()}`;
      const orderContent = parseOrderContent(notification.content);

      setToasts((prev) => {
        const next = [...prev, { id: toastId, notification, orderContent, reviewContent: null }];
        return next.slice(-MAX_TOASTS);
      });

      setTimeout(() => {
        dismissToast(toastId);
      }, 5000);
    },
    [dismissToast]
  );

  const handleNewReview = useCallback(
    (notification: Notification) => {
      setUnreadCount((prev) => prev + 1);

      const toastId = `${notification.id}-${Date.now()}`;
      const reviewContent = parseReviewContent(notification.content);
      const isPriority = reviewContent?.isPriority ?? false;

      setToasts((prev) => {
        const next = [...prev, { id: toastId, notification, orderContent: null, reviewContent }];
        return next.slice(-MAX_TOASTS);
      });

      setTimeout(() => {
        dismissToast(toastId);
      }, isPriority ? 10000 : 5000);
    },
    [dismissToast]
  );

  const { isConnected } = useSSENotifications({
    onNewNotification: handleNewNotification,
    onNewReview: handleNewReview,
  });

  return (
    <>
      <Link
        href="/notifications"
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={
          unreadCount > 0
            ? `Notificaciones, ${unreadCount} sin leer`
            : 'Notificaciones'
        }
        title={!isConnected ? 'Sin conexión en tiempo real — recarga la página' : undefined}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && <BadgeCount count={unreadCount} />}
        {!isConnected && (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-yellow-400"
            aria-label="Sin conexión en tiempo real"
          />
        )}
      </Link>

      {/* Toast portal — fixed bottom-right */}
      {toasts.length > 0 && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
          aria-label="Notificaciones recientes"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
    </>
  );
}

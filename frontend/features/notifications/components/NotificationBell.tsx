'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useSSENotifications } from '../hooks/useSSENotifications';
import { getUnreadCount } from '../shared/notifications.api';
import type { Notification, OrderNotificationContent, ReviewNotificationContent, ToastNotification } from '../types/notifications.types';
import {
  ROUTES,
  MAX_TOASTS,
  TOAST_DURATION_MS,
  TOAST_PRIORITY_DURATION_MS,
} from '../constants/notifications.constants';
import { parseNotificationContent } from '@/lib/utils/notifications';
import { NotificationBadge } from './NotificationBadge';
import { NotificationToastItem } from './NotificationToastItem';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const addToast = useCallback(
    (toast: ToastNotification, durationMs: number) => {
      setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS));
      setTimeout(() => dismissToast(toast.id), durationMs);
    },
    [dismissToast]
  );

  const handleNewNotification = useCallback(
    (notification: Notification) => {
      setUnreadCount((prev) => prev + 1);
      const orderContent = parseNotificationContent<OrderNotificationContent>(notification.content);
      addToast(
        { id: `${notification.id}-${Date.now()}`, notification, orderContent, reviewContent: null },
        TOAST_DURATION_MS
      );
    },
    [addToast]
  );

  const handleNewReview = useCallback(
    (notification: Notification) => {
      setUnreadCount((prev) => prev + 1);
      const reviewContent = parseNotificationContent<ReviewNotificationContent>(notification.content);
      addToast(
        { id: `${notification.id}-${Date.now()}`, notification, orderContent: null, reviewContent },
        reviewContent?.isPriority ? TOAST_PRIORITY_DURATION_MS : TOAST_DURATION_MS
      );
    },
    [addToast]
  );

  const { isConnected } = useSSENotifications({
    onNewNotification: handleNewNotification,
    onNewReview: handleNewReview,
  });

  return (
    <>
      <Link
        href={ROUTES.NOTIFICATIONS}
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'}
        title={!isConnected ? 'Sin conexión en tiempo real — recarga la página' : undefined}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <NotificationBadge count={unreadCount} />
        {!isConnected && (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-yellow-400"
            aria-label="Sin conexión en tiempo real"
          />
        )}
      </Link>

      {toasts.length > 0 && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
          aria-label="Notificaciones recientes"
        >
          {toasts.map((toast) => (
            <NotificationToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
    </>
  );
}

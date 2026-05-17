'use client';

import { useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useSSENotifications } from '@/features/notifications/hooks/useSSENotifications';
import { NotificationCard } from '@/features/notifications/components/NotificationCard';
import { NotificationPreferences } from '@/features/notifications/components/NotificationPreferences';
import { NOTIFICATION_STRINGS } from '@/features/notifications/constants/notifications.constants';
import type { Notification } from '@/features/notifications/types/notifications.types';

const strings = NOTIFICATION_STRINGS.page;

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markRead, markAllRead, refetch } =
    useNotifications();

  const handleNewNotification = useCallback(
    (_notification: Notification) => {
      refetch();
    },
    [refetch]
  );

  const handleNewReview = useCallback(
    (_notification: Notification) => {
      refetch();
    },
    [refetch]
  );

  useSSENotifications({
    onNewNotification: handleNewNotification,
    onNewReview: handleNewReview,
  });

  const hasUnread = unreadCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{strings.title}</h1>

        {hasUnread && (
          <button
            onClick={markAllRead}
            className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
          >
            {strings.markAllRead}
          </button>
        )}
      </div>

      {/* Notification list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg border border-border bg-muted"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{strings.empty}</p>
          <p className="text-xs text-muted-foreground">{strings.emptySubtitle}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Lista de notificaciones">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationCard
                notification={notification}
                onMarkRead={markRead}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Preferences */}
      <NotificationPreferences />
    </div>
  );
}

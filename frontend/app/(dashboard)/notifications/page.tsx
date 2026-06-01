'use client';

import { useCallback, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useSSENotifications } from '@/features/notifications/hooks/useSSENotifications';
import { NotificationCard } from '@/features/notifications/components/NotificationCard';

import { NOTIFICATION_STRINGS } from '@/features/notifications/constants/notifications.constants';
import type { Notification } from '@/features/notifications/types/notifications.types';

const strings = NOTIFICATION_STRINGS.page;

type ReadFilter = 'all' | 'unread' | 'read';

const FILTERS: { key: ReadFilter; label: string }[] = [
  { key: 'all', label: strings.filterAll },
  { key: 'unread', label: strings.filterUnread },
  { key: 'read', label: strings.filterRead },
];

const EMPTY_STATE: Record<ReadFilter, { title: string; subtitle: string }> = {
  all: { title: strings.empty, subtitle: strings.emptySubtitle },
  unread: { title: strings.emptyUnread, subtitle: strings.emptyUnreadSubtitle },
  read: { title: strings.emptyRead, subtitle: strings.emptyReadSubtitle },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markRead, refetch } = useNotifications();
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');

  const handleNewNotification = useCallback(
    (_notification: Notification) => { refetch(); },
    [refetch]
  );

  const handleNewReview = useCallback(
    (_notification: Notification) => { refetch(); },
    [refetch]
  );

  useSSENotifications({ onNewNotification: handleNewNotification, onNewReview: handleNewReview });

  const filtered = notifications.filter((n) => {
    if (readFilter === 'unread') return !n.read;
    if (readFilter === 'read') return n.read;
    return true;
  });

  const empty = EMPTY_STATE[readFilter];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-foreground">{strings.title}</h1>

      {/* Filtros */}
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label="Filtrar notificaciones"
      >
        {FILTERS.map(({ key, label }) => {
          const count = key === 'unread' ? unreadCount
            : key === 'read' ? notifications.filter((n) => n.read).length
            : notifications.length;
          const isActive = readFilter === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setReadFilter(key)}
              className={[
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
              <span className={[
                'rounded-full px-1.5 py-0.5 text-xs font-semibold',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground',
              ].join(' ')}
                aria-label={`${count} notificaciones`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-muted" aria-hidden="true" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{empty.title}</p>
          <p className="text-xs text-muted-foreground">{empty.subtitle}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Lista de notificaciones">
          {filtered.map((notification) => (
            <li key={notification.id}>
              <NotificationCard
                notification={notification}
                onMarkRead={markRead}
              />
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

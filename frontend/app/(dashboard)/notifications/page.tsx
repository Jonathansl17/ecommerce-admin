'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useSSENotifications } from '@/features/notifications/hooks/useSSENotifications';
import { NotificationCard } from '@/features/notifications/components/NotificationCard';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';

import {
  NOTIFICATION_PAGE_STRINGS as strings,
  NOTIFICATION_EMPTY_STATE,
  READ_FILTERS,
  type ReadFilter,
} from '@/features/notifications/constants/notifications.constants';
import type { Notification } from '@/features/notifications/types/notifications.types';

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markRead, markAllRead, remove, removeAll, refetch } =
    useNotifications();
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [page, setPage] = useState(1);

  const handleNewNotification = useCallback(
    (_notification: Notification) => { refetch(); },
    [refetch]
  );

  const handleNewReview = useCallback(
    (_notification: Notification) => { refetch(); },
    [refetch]
  );

  const { isConnected } = useSSENotifications({
    onNewNotification: handleNewNotification,
    onNewReview: handleNewReview,
  });

  const filtered = notifications.filter((n) => {
    if (readFilter === 'unread') return !n.read;
    if (readFilter === 'read') return n.read;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to page 1 when the filter changes.
  useEffect(() => {
    setPage(1);
  }, [readFilter]);

  // Step back if the current page becomes out of range (e.g. after deletes).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const empty = NOTIFICATION_EMPTY_STATE[readFilter];

  const handleDeleteAll = () => {
    if (window.confirm(strings.confirmDeleteAll)) removeAll();
  };

  return (
    <div className="space-y-6">
      {!isConnected && (
        <Alert variant="warning">{strings.disconnectedWarning}</Alert>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">{strings.title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            {strings.markAllRead}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {strings.deleteAll}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label={strings.ariaTabList}
      >
        {READ_FILTERS.map(({ key, label }) => {
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
                aria-label={strings.ariaCount(count)}
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
        <>
          <ul className="space-y-3" aria-label={strings.ariaList}>
            {pageItems.map((notification) => (
              <li key={notification.id}>
                <NotificationCard
                  notification={notification}
                  onMarkRead={markRead}
                  onDelete={remove}
                />
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

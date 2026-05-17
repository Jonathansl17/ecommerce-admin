'use client';

import { Check } from 'lucide-react';
import type { Notification, OrderNotificationContent } from '../types/notifications.types';
import { OrderNotificationContent as OrderContent } from './OrderNotificationContent';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.card;

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

function parseOrderContent(raw: string | null): OrderNotificationContent | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderNotificationContent;
  } catch {
    return null;
  }
}

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return strings.justNow;
  if (diffHours < 1) return strings.minutesAgo(diffMinutes);
  if (diffDays < 1) return strings.hoursAgo(diffHours);
  return strings.daysAgo(diffDays);
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const { id, title, content, entityType, read, createdAt } = notification;
  const orderContent =
    entityType === 'order' ? parseOrderContent(content) : null;
  const hasCustomization = orderContent?.hasCustomization ?? false;

  const handleMarkRead = () => {
    if (!read) onMarkRead(id);
  };

  return (
    <article
      className={[
        'group relative rounded-lg border p-4 transition-colors',
        !read
          ? 'border-l-4 border-border bg-accent/40'
          : 'border-border bg-card',
        hasCustomization ? 'border-l-4' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        hasCustomization
          ? { borderLeftColor: '#f59e0b', borderLeftWidth: '4px' }
          : !read
          ? { borderLeftColor: 'var(--primary)', borderLeftWidth: '4px' }
          : undefined
      }
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm font-medium ${read ? 'text-foreground' : 'text-foreground'}`}>
              {title}
            </p>
            {!read && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-primary"
                aria-label="No leída"
              />
            )}
            {hasCustomization && (
              <span
                className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
              >
                {NOTIFICATION_STRINGS.order.customizationBadge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(createdAt)}</p>
        </div>

        {!read && (
          <button
            onClick={handleMarkRead}
            className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100 focus:opacity-100"
            aria-label={strings.markRead}
            title={strings.markRead}
          >
            <Check className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {orderContent && (
        <div
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={handleMarkRead}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMarkRead();
            }
          }}
        >
          <OrderContent content={orderContent} />
        </div>
      )}
    </article>
  );
}

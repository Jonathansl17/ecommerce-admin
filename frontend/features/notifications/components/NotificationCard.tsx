'use client';

import { Check } from 'lucide-react';
import type {
  Notification,
  OrderNotificationContent,
  ReviewNotificationContent,
} from '../types/notifications.types';
import { OrderNotificationContent as OrderContent } from './OrderNotificationContent';
import { ReviewNotificationContent as ReviewContent } from './ReviewNotificationContent';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import { parseNotificationContent } from '@/lib/utils/notifications';

const strings = NOTIFICATION_STRINGS.card;

const BORDER_COLOR_NEGATIVE = '#ef4444';
const BORDER_COLOR_CUSTOMIZATION = '#f59e0b';

function getCardBorderStyle(
  isNegativeReview: boolean,
  isOrderWithCustomization: boolean,
  read: boolean,
): React.CSSProperties | undefined {
  if (isNegativeReview) return { borderLeftColor: BORDER_COLOR_NEGATIVE };
  if (isOrderWithCustomization) return { borderLeftColor: BORDER_COLOR_CUSTOMIZATION };
  if (!read) return { borderLeftColor: 'var(--primary)' };
  return undefined;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
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

  const orderContent = entityType === 'order' ? parseNotificationContent<OrderNotificationContent>(content) : null;
  const reviewContent = entityType === 'review' ? parseNotificationContent<ReviewNotificationContent>(content) : null;

  const isOrderWithCustomization = entityType === 'order' && (orderContent?.hasCustomization ?? false);
  const isNegativeReview = entityType === 'review' && (reviewContent?.isPriority ?? false);

  const handleMarkRead = () => {
    if (!read) onMarkRead(id);
  };

  // Left-border color: red > amber > primary (unread only)
  const borderStyle = getCardBorderStyle(isNegativeReview, isOrderWithCustomization, read);

  const hasPriorityBorder = isNegativeReview || isOrderWithCustomization || !read;

  return (
    <article
      className={[
        'group relative rounded-lg border transition-colors',
        hasPriorityBorder ? 'border-l-4 p-4' : 'border-border bg-card p-4 opacity-75',
        !read ? 'border-border bg-card shadow-sm' : 'border-border bg-card opacity-75',
      ]
        .filter(Boolean)
        .join(' ')}
      style={borderStyle}
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {!read && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                aria-label="No leída"
              />
            )}
            {isOrderWithCustomization && (
              <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                {NOTIFICATION_STRINGS.order.customizationBadge}
              </span>
            )}
            {isNegativeReview && (
              <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                {NOTIFICATION_STRINGS.review.priorityBadge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(createdAt)}</p>
        </div>

        {!read && (
          <button
            onClick={handleMarkRead}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      {reviewContent && (
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
          <ReviewContent content={reviewContent} />
        </div>
      )}
    </article>
  );
}

'use client';

import { Check } from 'lucide-react';
import type {
  OrderNotificationContent,
  ReviewNotificationContent,
} from '../types/notifications.types';
import type { NotificationCardProps } from '../types/notifications.types';
import { OrderNotificationContent as OrderContent } from './OrderNotificationContent';
import { ReviewNotificationContent as ReviewContent } from './ReviewNotificationContent';
import { NOTIFICATION_STRINGS, NOTIFICATION_CARD_STRINGS as strings } from '../constants/notifications.constants';
import { parseNotificationContent, getCardBorderStyle } from '@/lib/utils/notifications';
import { timeAgo } from '@/lib/utils/timeAgo';

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const { id, title, content, entityType, read, createdAt } = notification;

  const orderContent = entityType === 'order' ? parseNotificationContent<OrderNotificationContent>(content) : null;
  const reviewContent = entityType === 'review' ? parseNotificationContent<ReviewNotificationContent>(content) : null;

  const isOrderWithCustomization = entityType === 'order' && (orderContent?.hasCustomization ?? false);
  const isNegativeReview = entityType === 'review' && (reviewContent?.isPriority ?? false);

  const handleMarkRead = () => {
    if (!read) onMarkRead(id);
  };

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
          <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(createdAt, strings)}</p>
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

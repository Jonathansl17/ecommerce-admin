'use client';

import { MessageSquare } from 'lucide-react';
import type { ReviewModerationPanelProps, ReviewTab, StatusFilter } from '../types/reviews.types';
import {
  REVIEWS_STRINGS as strings,
  REVIEWS_TABS_STRINGS,
  REVIEWS_EMPTY_STRINGS,
} from '../constants/reviews.constants';
import { ReviewModerationCard } from './ReviewModerationCard';

const TABS: ReviewTab[] = [
  { key: 'pending', label: REVIEWS_TABS_STRINGS.pending },
  { key: 'approved', label: REVIEWS_TABS_STRINGS.approved },
  { key: 'rejected', label: REVIEWS_TABS_STRINGS.rejected },
  { key: 'all', label: REVIEWS_TABS_STRINGS.all },
];

function countForStatus(reviews: ReviewModerationPanelProps['reviews'], status: StatusFilter): number {
  if (status === 'all') return reviews.length;
  return reviews.filter((r) => r.status === status).length;
}

export function ReviewModerationPanel({
  reviews,
  statusFilter,
  onFilterChange,
  onApprove,
  onReject,
  onRespond,
  loadingId,
  errorId,
}: ReviewModerationPanelProps) {
  const emptyMessage = REVIEWS_EMPTY_STRINGS[statusFilter];

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label={strings.panel.ariaTabList}
      >
        {TABS.map(({ key, label }) => {
          const count = countForStatus(reviews, key);
          const isActive = statusFilter === key;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(key)}
              className={[
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-xs font-medium',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground',
                ].join(' ')}
                aria-label={strings.panel.ariaCount(count)}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {reviews.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center"
          role="status"
        >
          <MessageSquare className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={strings.panel.ariaList}>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewModerationCard
                review={review}
                onApprove={onApprove}
                onReject={onReject}
                onRespond={onRespond}
                loadingId={loadingId}
                errorId={errorId}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

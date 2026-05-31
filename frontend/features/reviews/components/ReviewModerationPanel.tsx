'use client';

import { MessageSquare } from 'lucide-react';
import type { Review, ReviewStatus, ModerationReason } from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';
import { ReviewModerationCard } from './ReviewModerationCard';

type StatusFilter = ReviewStatus | 'all';

const strings = REVIEWS_STRINGS;

interface Tab {
  key: StatusFilter;
  label: string;
}

const TABS: Tab[] = [
  { key: 'pending', label: strings.tabs.pending },
  { key: 'approved', label: strings.tabs.approved },
  { key: 'rejected', label: strings.tabs.rejected },
  { key: 'all', label: strings.tabs.all },
];

interface ReviewModerationPanelProps {
  reviews: Review[];
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  loadingId: string | null;
}

function countForStatus(reviews: Review[], status: StatusFilter): number {
  if (status === 'all') return reviews.length;
  return reviews.filter((r) => r.status === status).length;
}

export function ReviewModerationPanel({
  reviews,
  statusFilter,
  onFilterChange,
  onApprove,
  onReject,
  loadingId,
}: ReviewModerationPanelProps) {
  const emptyMessages: Record<StatusFilter, string> = {
    all: strings.empty.all,
    pending: strings.empty.pending,
    approved: strings.empty.approved,
    rejected: strings.empty.rejected,
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label="Filtrar reseñas por estado"
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
                aria-label={`${count} reseñas`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center"
          role="status"
        >
          <MessageSquare className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{emptyMessages[statusFilter]}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Lista de reseñas">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewModerationCard
                review={review}
                onApprove={onApprove}
                onReject={onReject}
                loadingId={loadingId}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

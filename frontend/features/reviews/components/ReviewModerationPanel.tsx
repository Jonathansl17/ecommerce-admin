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
  badgeActive: string;
  badgeInactive: string;
}

const TABS: Tab[] = [
  {
    key: 'pending',
    label: strings.tabs.pending,
    badgeActive: 'bg-amber-500 text-white',
    badgeInactive: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'approved',
    label: strings.tabs.approved,
    badgeActive: 'bg-green-500 text-white',
    badgeInactive: 'bg-green-100 text-green-700',
  },
  {
    key: 'rejected',
    label: strings.tabs.rejected,
    badgeActive: 'bg-red-500 text-white',
    badgeInactive: 'bg-red-100 text-red-700',
  },
  {
    key: 'all',
    label: strings.tabs.all,
    badgeActive: 'bg-primary text-primary-foreground',
    badgeInactive: 'bg-muted-foreground/20 text-muted-foreground',
  },
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

const emptyTitles: Record<StatusFilter, string> = {
  all: strings.empty.all,
  pending: strings.empty.pending,
  approved: strings.empty.approved,
  rejected: strings.empty.rejected,
};

const emptySubtitles: Record<StatusFilter, string> = {
  all: strings.empty.allSubtitle,
  pending: strings.empty.pendingSubtitle,
  approved: strings.empty.approvedSubtitle,
  rejected: strings.empty.rejectedSubtitle,
};

export function ReviewModerationPanel({
  reviews,
  statusFilter,
  onFilterChange,
  onApprove,
  onReject,
  loadingId,
}: ReviewModerationPanelProps) {
  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label="Filtrar reseñas por estado"
      >
        {TABS.map(({ key, label, badgeActive, badgeInactive }) => {
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
                  'rounded-full px-1.5 py-0.5 text-xs font-semibold transition-colors',
                  isActive ? badgeActive : badgeInactive,
                ].join(' ')}
                aria-label={`${count} reseñas`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Review list / empty state */}
      {reviews.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center"
          role="status"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{emptyTitles[statusFilter]}</p>
            <p className="text-xs text-muted-foreground max-w-xs">{emptySubtitles[statusFilter]}</p>
          </div>
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

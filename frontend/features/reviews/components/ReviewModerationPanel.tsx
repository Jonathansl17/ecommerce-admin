'use client';

import { MessageSquare } from 'lucide-react';
import type {
  ReviewModerationPanelProps,
  ReviewStatusFilter,
} from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';
import { ReviewModerationCard } from './ReviewModerationCard';
import { ReviewStatusTabs } from './ReviewStatusTabs';
import { ReviewSearchFilters } from './ReviewSearchFilters';
import { ReviewPagination } from './ReviewPagination';

const strings = REVIEWS_STRINGS;

const emptyMessages: Record<ReviewStatusFilter, string> = {
  all: strings.empty.all,
  pending: strings.empty.pending,
  approved: strings.empty.approved,
  rejected: strings.empty.rejected,
};

export function ReviewModerationPanel({
  reviews,
  counts,
  statusFilter,
  onFilterChange,
  onSearch,
  onClearSearch,
  onApprove,
  onReject,
  onRespond,
  onDelete,
  page,
  pageSize,
  total,
  onPageChange,
  isLoading,
  loadingId,
  errorId,
}: ReviewModerationPanelProps) {
  return (
    <div className="space-y-4">
      {/* Filters: status tabs + product/person search, on the same row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ReviewStatusTabs
          statusFilter={statusFilter}
          counts={counts}
          onFilterChange={onFilterChange}
        />
        <ReviewSearchFilters onSearch={onSearch} onClear={onClearSearch} />
      </div>

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-3" aria-busy="true" aria-label={strings.a11y.loading}>
          {Array.from({ length: pageSize }, (_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-border bg-muted"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center"
          role="status"
        >
          <MessageSquare className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={strings.a11y.list}>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewModerationCard
                review={review}
                onApprove={onApprove}
                onReject={onReject}
                onRespond={onRespond}
                onDelete={onDelete}
                loadingId={loadingId}
                errorId={errorId}
              />
            </li>
          ))}
        </ul>
      )}

      <ReviewPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}

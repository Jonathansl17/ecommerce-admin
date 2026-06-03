'use client';

import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type {
  ReviewModerationPanelProps,
  ReviewStatusFilter,
} from '../types/reviews.types';
import {
  REVIEW_STATUS_FILTER_ALL,
  REVIEW_TAB_KEYS,
  REVIEWS_STRINGS,
} from '../constants/reviews.constants';
import { ReviewModerationCard } from './ReviewModerationCard';

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
  onApprove,
  onReject,
  onRespond,
  onDelete,
  page,
  pageSize,
  total,
  onPageChange,
  loadingId,
  errorId,
}: ReviewModerationPanelProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label={strings.a11y.filterTabs}
      >
        {REVIEW_TAB_KEYS.map((key) => {
          const count = key === REVIEW_STATUS_FILTER_ALL ? counts.total : counts[key];
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
              {strings.tabs[key]}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-xs font-medium',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground',
                ].join(' ')}
                aria-label={strings.a11y.countLabel(count)}
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

      {/* Pagination */}
      {total > 0 && (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
          aria-label={strings.a11y.pagination}
        >
          <p className="text-xs text-muted-foreground">{strings.pagination.totalItems(total)}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={strings.pagination.previous}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {strings.pagination.previous}
            </button>

            <span className="text-xs font-medium text-muted-foreground" aria-current="page">
              {strings.pagination.pageInfo(page, totalPages)}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={strings.pagination.next}
            >
              {strings.pagination.next}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

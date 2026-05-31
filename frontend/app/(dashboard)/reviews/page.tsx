'use client';

import { useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import type { Review, ModerationReason } from '@/features/reviews/types/reviews.types';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { useReviewActions } from '@/features/reviews/hooks/useReviewActions';
import { ReviewModerationPanel } from '@/features/reviews/components/ReviewModerationPanel';
import { REVIEWS_STRINGS } from '@/features/reviews/constants/reviews.constants';

const strings = REVIEWS_STRINGS;

export default function ReviewsPage() {
  const { reviews, isLoading, error, statusFilter, setStatusFilter, refetch } =
    useReviews();
  const { approve, reject, loadingId } = useReviewActions();

  const handleApprove = useCallback(
    (id: string) => {
      void approve(id, (_updated: Review) => {
        refetch();
      });
    },
    [approve, refetch]
  );

  const handleReject = useCallback(
    (id: string, reason: ModerationReason, notes?: string) => {
      void reject(id, reason, notes, (_updated: Review) => {
        refetch();
      });
    },
    [reject, refetch]
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-800">{strings.errors.fetchErrorTitle}</p>
            <p className="text-xs text-red-600">{strings.errors.fetchError}</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Cargando reseñas">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-border bg-muted"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <ReviewModerationPanel
          reviews={reviews}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onApprove={handleApprove}
          onReject={handleReject}
          loadingId={loadingId}
        />
      )}
    </div>
  );
}

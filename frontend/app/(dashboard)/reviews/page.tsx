'use client';

import { useCallback } from 'react';
import type { Review, ModerationReason } from '@/features/reviews/types/reviews.types';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { useReviewActions } from '@/features/reviews/hooks/useReviewActions';
import { ReviewModerationPanel } from '@/features/reviews/components/ReviewModerationPanel';
import { REVIEWS_STRINGS } from '@/features/reviews/constants/reviews.constants';

const strings = REVIEWS_STRINGS;

export default function ReviewsPage() {
  const { reviews, isLoading, error, statusFilter, setStatusFilter, refetch } =
    useReviews();
  const { approve, reject, respond, loadingId, actionError } = useReviewActions();

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

  const handleRespond = useCallback(
    (id: string, responseText: string) => {
      void respond(id, responseText, (_updated: Review) => {
        refetch();
      });
    },
    [respond, refetch]
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
          className="rounded-md p-3 text-sm font-medium"
          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          role="alert"
        >
          {strings.errors.fetchError}
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
          onRespond={handleRespond}
          loadingId={loadingId}
          errorId={actionError}
        />
      )}
    </div>
  );
}

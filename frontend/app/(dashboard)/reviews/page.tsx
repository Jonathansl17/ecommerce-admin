'use client';

import { useCallback, useState } from 'react';
import type { Review, ModerationReason } from '@/features/reviews/types/reviews.types';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { useReviewActions } from '@/features/reviews/hooks/useReviewActions';
import { ReviewModerationPanel } from '@/features/reviews/components/ReviewModerationPanel';
import { REVIEWS_STRINGS } from '@/features/reviews/constants/reviews.constants';
import { Toast, ToastContainer, type ToastVariant } from '@/components/ui/Toast';

const strings = REVIEWS_STRINGS;

const ERROR_BADGE_BG = '#fee2e2';
const ERROR_BADGE_TEXT = '#991b1b';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

export default function ReviewsPage() {
  const { reviews, isLoading, error, statusFilter, setStatusFilter, refetch } = useReviews();
  const { approve, reject, loadingId } = useReviewActions();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleApprove = useCallback(
    (id: string) => {
      void approve(
        id,
        (_updated: Review) => {
          refetch();
          showToast(strings.toasts.approved, 'success');
        },
        () => showToast(strings.toasts.approveError, 'error')
      );
    },
    [approve, refetch, showToast]
  );

  const handleReject = useCallback(
    (id: string, reason: ModerationReason, notes?: string) => {
      void reject(
        id,
        reason,
        notes,
        (_updated: Review) => {
          refetch();
          showToast(strings.toasts.rejected, 'success');
        },
        () => showToast(strings.toasts.rejectError, 'error')
      );
    },
    [reject, refetch, showToast]
  );

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        </div>

        {/* Error state */}
        {error && (
          <div
            className="rounded-md p-3 text-sm font-medium"
            style={{ backgroundColor: ERROR_BADGE_BG, color: ERROR_BADGE_TEXT }}
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
            loadingId={loadingId}
          />
        )}
      </div>

      <ToastContainer>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            variant={t.variant}
            onDismiss={() => dismissToast(t.id)}
          />
        ))}
      </ToastContainer>
    </>
  );
}

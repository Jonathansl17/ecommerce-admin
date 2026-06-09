'use client';

import { useCallback, useState } from 'react';
import type { Review, ModerationReason, ToastItem } from '@/features/reviews/types/reviews.types';
import { useReviews } from '@/features/reviews/hooks/useReviews';
import { useReviewActions } from '@/features/reviews/hooks/useReviewActions';
import { ReviewModerationPanel } from '@/features/reviews/components/ReviewModerationPanel';
import { REVIEWS_STRINGS as strings } from '@/features/reviews/constants/reviews.constants';
import { Toast, ToastContainer, type ToastVariant } from '@/components/ui/Toast';

export default function ReviewsPage() {
  const {
    reviews,
    stats,
    total,
    page,
    pageSize,
    setPage,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    applySearch,
    clearSearch,
    refetch,
  } = useReviews();
  const { approve, reject, respond, remove, loadingId, actionError } =
    useReviewActions();

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

  const handleRespond = useCallback(
    (id: string, responseText: string) => {
      void respond(id, responseText, (_updated: Review) => {
        refetch();
      });
    },
    [respond, refetch]
  );

  const handleDelete = useCallback(
    (id: string, reason: ModerationReason, detail?: string) => {
      void remove(id, reason, detail, () => {
        refetch();
      });
    },
    [remove, refetch]
  );

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        </div>

      <ReviewModerationPanel
        reviews={reviews}
        counts={stats}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onSearch={applySearch}
        onClearSearch={clearSearch}
        onApprove={handleApprove}
        onReject={handleReject}
        onRespond={handleRespond}
        onDelete={handleDelete}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        isLoading={isLoading}
        loadingId={loadingId}
        errorId={actionError}
      />
    </div>
  );
}

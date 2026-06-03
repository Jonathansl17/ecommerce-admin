'use client';

import { useState } from 'react';
import type {
  ReviewModerationCardProps,
  ActiveReviewModal,
} from '../types/reviews.types';
import { REVIEW_MODAL, REVIEWS_STRINGS } from '../constants/reviews.constants';
import { ReviewCardHeader } from './ReviewCardHeader';
import { ReviewModerationActions } from './ReviewModerationActions';
import { ReviewModerationModals } from './ReviewModerationModals';

const cardStrings = REVIEWS_STRINGS.card;
const errorStrings = REVIEWS_STRINGS.errors;

const errorForModal = (active: ActiveReviewModal): string => {
  switch (active) {
    case REVIEW_MODAL.delete:
      return errorStrings.deleteError;
    case REVIEW_MODAL.reject:
      return errorStrings.rejectError;
    case REVIEW_MODAL.respond:
      return errorStrings.respondError;
    default:
      return errorStrings.approveError;
  }
};

export function ReviewModerationCard({
  review,
  onApprove,
  onReject,
  onRespond,
  onDelete,
  loadingId,
  errorId,
}: ReviewModerationCardProps) {
  const [activeModal, setActiveModal] = useState<ActiveReviewModal>(null);

  const isThisLoading = loadingId === review.id;
  const hasError = errorId === review.id;

  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

  return (
    <>
      <article
        className="rounded-lg border border-border bg-card p-4 transition-colors"
        aria-label={REVIEWS_STRINGS.a11y.cardLabel(clientName, productName)}
      >
        <ReviewCardHeader review={review} />

        <p className="mt-3 text-sm text-foreground">{review.comment}</p>

        {review.adminResponse && (
          <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              {cardStrings.responseSectionLabel}
            </p>
            <p className="text-sm text-foreground">{review.adminResponse}</p>
          </div>
        )}

        {hasError && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {errorForModal(activeModal)}
          </p>
        )}

        <ReviewModerationActions
          review={review}
          isLoading={isThisLoading}
          onApprove={onApprove}
          onOpenReject={() => setActiveModal(REVIEW_MODAL.reject)}
          onOpenRespond={() => setActiveModal(REVIEW_MODAL.respond)}
          onOpenDelete={() => setActiveModal(REVIEW_MODAL.delete)}
        />
      </article>

      <ReviewModerationModals
        review={review}
        active={activeModal}
        isLoading={isThisLoading}
        onClose={() => setActiveModal(null)}
        onReject={onReject}
        onRespond={onRespond}
        onDelete={onDelete}
      />
    </>
  );
}

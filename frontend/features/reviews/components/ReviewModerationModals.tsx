'use client';

import type { ReviewModerationModalsProps } from '../types/reviews.types';
import { REVIEW_MODAL } from '../constants/reviews.constants';
import { RejectReviewModal } from './RejectReviewModal';
import { RespondReviewModal } from './RespondReviewModal';
import { DeleteReviewModal } from './DeleteReviewModal';

// Renders the moderation modal that matches the active action. Each modal stays
// open until the action completes — the parent closes it via `onClose`.
export function ReviewModerationModals({
  review,
  active,
  isLoading,
  onClose,
  onReject,
  onRespond,
  onDelete,
}: ReviewModerationModalsProps) {
  if (active === REVIEW_MODAL.reject) {
    return (
      <RejectReviewModal
        reviewId={review.id}
        isLoading={isLoading}
        onConfirm={(reason, notes) => onReject(review.id, reason, notes)}
        onClose={onClose}
      />
    );
  }

  if (active === REVIEW_MODAL.respond) {
    return (
      <RespondReviewModal
        isLoading={isLoading}
        onConfirm={(responseText) => onRespond(review.id, responseText)}
        onClose={onClose}
      />
    );
  }

  if (active === REVIEW_MODAL.delete) {
    return (
      <DeleteReviewModal
        review={review}
        isLoading={isLoading}
        onConfirm={(reason, detail) => onDelete(review.id, reason, detail)}
        onClose={onClose}
      />
    );
  }

  return null;
}

'use client';

import { useState } from 'react';
import { ThumbsUp, XCircle, MessageSquare } from 'lucide-react';
import type { ReviewCardActionsProps } from '../types/reviews.types';
import { REVIEWS_CARD_STRINGS as strings, REVIEWS_ERRORS_STRINGS as errorStrings } from '../constants/reviews.constants';
import { RejectReviewModal } from './RejectReviewModal';
import { RespondReviewModal } from './RespondReviewModal';

export function ReviewCardActions({
  reviewId,
  clientName,
  isPending,
  canRespond,
  isLoading,
  hasError,
  hasAdminResponse,
  onApprove,
  onReject,
  onRespond,
}: ReviewCardActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [respondOpen, setRespondOpen] = useState(false);

  const errorMessage = rejectOpen
    ? errorStrings.rejectError
    : respondOpen
      ? errorStrings.respondError
      : errorStrings.approveError;

  return (
    <>
      {hasError && (
        <p role="alert" className="mt-2 text-xs text-destructive">{errorMessage}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Acciones de moderación">
        {isPending && (
          <>
            <button
              type="button"
              onClick={() => onApprove(reviewId)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              aria-label={`${strings.approve} reseña de ${clientName}`}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
              {strings.approve}
            </button>

            <button
              type="button"
              onClick={() => setRejectOpen(true)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
              aria-label={`${strings.reject} reseña de ${clientName}`}
            >
              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {strings.reject}
            </button>
          </>
        )}

        {canRespond && (
          <button
            type="button"
            onClick={() => setRespondOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            aria-label={`${strings.respond} a reseña de ${clientName}`}
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {hasAdminResponse ? strings.editResponse : strings.respond}
          </button>
        )}
      </div>

      {rejectOpen && (
        <RejectReviewModal
          reviewId={reviewId}
          isLoading={isLoading}
          onConfirm={(reason, notes) => onReject(reviewId, reason, notes)}
          onClose={() => setRejectOpen(false)}
        />
      )}

      {respondOpen && (
        <RespondReviewModal
          isLoading={isLoading}
          onConfirm={(responseText) => onRespond(reviewId, responseText)}
          onClose={() => setRespondOpen(false)}
        />
      )}
    </>
  );
}

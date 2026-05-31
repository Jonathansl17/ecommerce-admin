'use client';

import { useState } from 'react';
import { ThumbsUp, XCircle, MessageSquare } from 'lucide-react';
import type { Review, ModerationReason } from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';
import { StarRating } from './StarRating';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { RejectReviewModal } from './RejectReviewModal';
import { RespondReviewModal } from './RespondReviewModal';

const strings = REVIEWS_STRINGS.card;
const timeStrings = REVIEWS_STRINGS.time;
const errorStrings = REVIEWS_STRINGS.errors;

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return timeStrings.justNow;
  if (diffHours < 1) return timeStrings.minutesAgo(diffMinutes);
  if (diffDays < 1) return timeStrings.hoursAgo(diffHours);
  return timeStrings.daysAgo(diffDays);
}

interface ReviewModerationCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: ModerationReason, notes?: string) => void;
  onRespond: (id: string, responseText: string) => void;
  loadingId: string | null;
  errorId: string | null;
}

export function ReviewModerationCard({
  review,
  onApprove,
  onReject,
  onRespond,
  loadingId,
  errorId,
}: ReviewModerationCardProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [respondOpen, setRespondOpen] = useState(false);

  const isThisLoading = loadingId === review.id;
  const hasError = errorId === review.id;
  const isPending = review.status === 'pending';
  const canRespond = review.status === 'approved' || review.status === 'pending';

  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

  return (
    <>
      <article
        className="rounded-lg border border-border bg-card p-4 transition-colors"
        aria-label={`Reseña de ${clientName} sobre ${productName}`}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{productName}</p>
              <ReviewStatusBadge status={review.status} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{clientName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Review text */}
        <p className="mt-3 text-sm text-foreground">{review.comment}</p>

        {/* Admin response (if any) */}
        {review.adminResponse && (
          <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              {strings.responseSectionLabel}
            </p>
            <p className="text-sm text-foreground">{review.adminResponse}</p>
          </div>
        )}

        {/* Error feedback */}
        {hasError && (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {rejectOpen ? errorStrings.rejectError : respondOpen ? errorStrings.respondError : errorStrings.approveError}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Acciones de moderación">
          {isPending && (
            <>
              <button
                type="button"
                onClick={() => onApprove(review.id)}
                disabled={isThisLoading}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#22c55e' }}
                aria-label={`${strings.approve} reseña de ${clientName}`}
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                {strings.approve}
              </button>

              <button
                type="button"
                onClick={() => setRejectOpen(true)}
                disabled={isThisLoading}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#ef4444' }}
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
              disabled={isThisLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              aria-label={`${strings.respond} a reseña de ${clientName}`}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {review.adminResponse ? 'Editar respuesta' : strings.respond}
            </button>
          )}
        </div>
      </article>

      {rejectOpen && (
        <RejectReviewModal
          reviewId={review.id}
          isLoading={isThisLoading}
          onConfirm={(reason, notes) => {
            onReject(review.id, reason, notes);
            // Modal stays open until action completes — closed by parent on success
          }}
          onClose={() => setRejectOpen(false)}
        />
      )}

      {respondOpen && (
        <RespondReviewModal
          isLoading={isThisLoading}
          onConfirm={(responseText) => {
            onRespond(review.id, responseText);
            // Modal stays open until action completes — closed by parent on success
          }}
          onClose={() => setRespondOpen(false)}
        />
      )}
    </>
  );
}

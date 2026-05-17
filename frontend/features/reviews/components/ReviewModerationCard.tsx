'use client';

import { useState, type CSSProperties } from 'react';
import { MessageSquare, ThumbsUp, XCircle } from 'lucide-react';
import type { Review, ModerationReason } from '../types/reviews.types';
import { REVIEWS_STRINGS, MODERATION_REASON_LABELS } from '../constants/reviews.constants';
import { StarRating } from './StarRating';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { RejectReviewModal } from './RejectReviewModal';
import { RespondReviewModal } from './RespondReviewModal';

const strings = REVIEWS_STRINGS.card;
const timeStrings = REVIEWS_STRINGS.time;

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
  onRespond: (id: string, text: string) => void;
  loadingId: string | null;
}

export function ReviewModerationCard({
  review,
  onApprove,
  onReject,
  onRespond,
  loadingId,
}: ReviewModerationCardProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [respondOpen, setRespondOpen] = useState(false);

  const isThisLoading = loadingId === review.id;
  const isPending = review.status === 'pending';
  const canRespond =
    review.status === 'approved' && review.adminResponse === null;

  const cardStyle: CSSProperties = review.isPriority
    ? { borderLeftColor: '#ef4444', borderLeftWidth: '4px' }
    : {};

  return (
    <>
      <article
        className={[
          'rounded-lg border border-border bg-card p-4 transition-colors',
          review.isPriority ? 'border-l-4' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={cardStyle}
        aria-label={`Reseña de ${review.clientName} sobre ${review.productName}`}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{review.productName}</p>
              <ReviewStatusBadge status={review.status} />
              {review.isPriority && (
                <span
                  className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                >
                  {strings.priorityBadge}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{review.clientName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Review text */}
        <p className="mt-3 text-sm text-foreground">{review.reviewText}</p>

        {/* Admin response */}
        {review.adminResponse && (
          <div
            className="mt-3 rounded-md border border-border bg-muted p-3"
            aria-label={strings.responseSectionLabel}
          >
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {strings.responseSectionLabel} — {strings.byAdmin(review.adminResponse.adminName)}
            </p>
            <p className="text-sm text-foreground">{review.adminResponse.text}</p>
          </div>
        )}

        {/* Moderation record */}
        {review.moderationRecord && (
          <div
            className="mt-3 rounded-md p-3"
            style={{ backgroundColor: '#fee2e2' }}
            aria-label={strings.moderationSectionLabel}
          >
            <p className="mb-1 text-xs font-medium" style={{ color: '#991b1b' }}>
              {strings.moderationSectionLabel}:{' '}
              {MODERATION_REASON_LABELS[review.moderationRecord.reason]}
            </p>
            {review.moderationRecord.notes && (
              <p className="text-xs" style={{ color: '#7f1d1d' }}>
                {review.moderationRecord.notes}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        {(isPending || canRespond) && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Acciones de moderación">
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove(review.id)}
                  disabled={isThisLoading}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#22c55e' }}
                  aria-label={`${strings.approve} reseña de ${review.clientName}`}
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
                  aria-label={`${strings.reject} reseña de ${review.clientName}`}
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {strings.reject}
                </button>
              </>
            )}

            {(isPending || canRespond) && (
              <button
                type="button"
                onClick={() => setRespondOpen(true)}
                disabled={isThisLoading}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
                aria-label={`${strings.respond} a reseña de ${review.clientName}`}
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                {strings.respond}
              </button>
            )}
          </div>
        )}
      </article>

      {rejectOpen && (
        <RejectReviewModal
          reviewId={review.id}
          isLoading={isThisLoading}
          onConfirm={(reason, notes) => {
            onReject(review.id, reason, notes);
            setRejectOpen(false);
          }}
          onClose={() => setRejectOpen(false)}
        />
      )}

      {respondOpen && (
        <RespondReviewModal
          reviewId={review.id}
          isLoading={isThisLoading}
          onConfirm={(text) => {
            onRespond(review.id, text);
            setRespondOpen(false);
          }}
          onClose={() => setRespondOpen(false)}
        />
      )}
    </>
  );
}

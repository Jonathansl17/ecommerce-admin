'use client';

import type { ReviewModerationCardProps } from '../types/reviews.types';
import { REVIEWS_CARD_STRINGS as strings, REVIEWS_TIME_STRINGS } from '../constants/reviews.constants';
import { timeAgo } from '@/lib/utils/timeAgo';
import { StarRating } from './StarRating';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { ReviewCardActions } from './ReviewCardActions';

export function ReviewModerationCard({
  review,
  onApprove,
  onReject,
  onRespond,
  loadingId,
  errorId,
}: ReviewModerationCardProps) {
  const isThisLoading = loadingId === review.id;
  const hasError = errorId === review.id;
  const isPending = review.status === 'pending';
  const canRespond = review.status === 'approved';
  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

  return (
    <article
      className="rounded-lg border border-border bg-card p-4 transition-colors"
      aria-label={`Reseña de ${clientName} sobre ${productName}`}
    >
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
            <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt, REVIEWS_TIME_STRINGS)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground">{review.comment}</p>

      {review.adminResponse && (
        <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
            {strings.responseSectionLabel}
          </p>
          <p className="text-sm text-foreground">{review.adminResponse}</p>
        </div>
      )}

      <ReviewCardActions
        reviewId={review.id}
        clientName={clientName}
        isPending={isPending}
        canRespond={canRespond}
        isLoading={isThisLoading}
        hasError={hasError}
        hasAdminResponse={!!review.adminResponse}
        onApprove={onApprove}
        onReject={onReject}
        onRespond={onRespond}
      />
    </article>
  );
}

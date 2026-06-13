'use client';

import type { ReviewSummaryProps } from '../types/reviews.types';
import { StarRating } from './StarRating';

// Compact, read-only summary of a review (product · rating · author + comment).
export function ReviewSummary({ review, label }: ReviewSummaryProps) {
  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

  return (
    <div className="space-y-1.5 rounded-md border border-border bg-muted/50 p-3">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">{productName}</span>
        <span className="text-xs text-muted-foreground">·</span>
        <StarRating rating={review.rating} />
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">{clientName}</span>
      </div>
      <p className="line-clamp-2 text-sm text-foreground/80">{review.comment}</p>
    </div>
  );
}

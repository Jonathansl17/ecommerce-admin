'use client';

import type { ReviewCardHeaderProps } from '../types/reviews.types';
import { REVIEWS_STRINGS } from '../constants/reviews.constants';
import { timeAgo } from '@/lib/utils/timeAgo';
import { StarRating } from './StarRating';
import { ReviewStatusBadge } from './ReviewStatusBadge';

export function ReviewCardHeader({ review }: ReviewCardHeaderProps) {
  const productName = review.product?.name ?? '';
  const clientName = review.clientUser?.fullName ?? '';

  return (
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
          <span className="text-xs text-muted-foreground">
            {timeAgo(review.createdAt, REVIEWS_STRINGS.time)}
          </span>
        </div>
      </div>
    </div>
  );
}

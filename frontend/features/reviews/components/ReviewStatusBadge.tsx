'use client';

import type { CSSProperties } from 'react';
import type { ReviewStatus } from '../types/reviews.types';
import { REVIEW_STATUS_LABELS } from '../constants/reviews.constants';

interface ReviewStatusBadgeProps {
  status: ReviewStatus;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const styles: Record<ReviewStatus, CSSProperties> = {
    pending: {},
    approved: { backgroundColor: '#dcfce7', color: '#166534' },
    rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  };

  const baseClass =
    'inline-block rounded px-2 py-0.5 text-xs font-medium';

  if (status === 'pending') {
    return (
      <span className={`${baseClass} bg-muted text-muted-foreground`}>
        {REVIEW_STATUS_LABELS[status]}
      </span>
    );
  }

  return (
    <span className={baseClass} style={styles[status]}>
      {REVIEW_STATUS_LABELS[status]}
    </span>
  );
}

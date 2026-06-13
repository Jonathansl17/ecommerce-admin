'use client';

import type { CSSProperties } from 'react';
import type { ReviewStatus, ReviewStatusBadgeProps } from '../types/reviews.types';
import { REVIEW_STATUS, REVIEW_STATUS_LABELS } from '../constants/reviews.constants';

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const styles: Record<ReviewStatus, CSSProperties> = {
    pending: {},
    approved: { backgroundColor: '#dcfce7', color: '#166534' },
    rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  };

  const baseClass =
    'inline-block rounded px-2 py-0.5 text-xs font-medium';

  if (status === REVIEW_STATUS.pending) {
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

'use client';

import { useState, useCallback } from 'react';
import type { Review, ModerationReason } from '../types/reviews.types';
import { approveReview, rejectReview } from '../shared/reviews.api';

interface UseReviewActionsReturn {
  approve: (id: string, onSuccess: (updated: Review) => void) => Promise<void>;
  reject: (
    id: string,
    reason: ModerationReason,
    notes: string | undefined,
    onSuccess: (updated: Review) => void
  ) => Promise<void>;
  loadingId: string | null;
}

export function useReviewActions(): UseReviewActionsReturn {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const approve = useCallback(
    async (id: string, onSuccess: (updated: Review) => void) => {
      setLoadingId(id);
      try {
        const updated = await approveReview(id);
        onSuccess(updated);
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  const reject = useCallback(
    async (
      id: string,
      reason: ModerationReason,
      notes: string | undefined,
      onSuccess: (updated: Review) => void
    ) => {
      setLoadingId(id);
      try {
        const updated = await rejectReview(id, { reason, notes });
        onSuccess(updated);
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  return { approve, reject, loadingId };
}

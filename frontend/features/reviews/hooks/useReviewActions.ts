'use client';

import { useState, useCallback } from 'react';
import type { Review, ModerationReason } from '../types/reviews.types';
import { approveReview, rejectReview, respondToReview } from '../shared/reviews.api';

interface UseReviewActionsReturn {
  approve: (
    id: string,
    onSuccess: (updated: Review) => void,
    onError?: () => void
  ) => Promise<void>;
  reject: (
    id: string,
    reason: ModerationReason,
    notes: string | undefined,
    onSuccess: (updated: Review) => void,
    onError?: () => void
  ) => Promise<void>;
  respond: (
    id: string,
    responseText: string,
    onSuccess: (updated: Review) => void
  ) => Promise<void>;
  loadingId: string | null;
  actionError: string | null;
  clearError: () => void;
}

export function useReviewActions(): UseReviewActionsReturn {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const clearError = useCallback(() => setActionError(null), []);

  const approve = useCallback(
    async (
      id: string,
      onSuccess: (updated: Review) => void,
      onError?: () => void
    ) => {
      setLoadingId(id);
      setActionError(null);
      try {
        const updated = await approveReview(id);
        onSuccess(updated);
      } catch {
        setActionError(id);
        onError?.();
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
      onSuccess: (updated: Review) => void,
      onError?: () => void
    ) => {
      setLoadingId(id);
      setActionError(null);
      try {
        const updated = await rejectReview(id, { reason, notes });
        onSuccess(updated);
      } catch {
        setActionError(id);
        onError?.();
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  const respond = useCallback(
    async (
      id: string,
      responseText: string,
      onSuccess: (updated: Review) => void
    ) => {
      setLoadingId(id);
      setActionError(null);
      try {
        const updated = await respondToReview(id, responseText);
        onSuccess(updated);
      } catch {
        setActionError(id);
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  return { approve, reject, respond, loadingId, actionError, clearError };
}

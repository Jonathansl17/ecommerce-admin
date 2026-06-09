'use client';

import { useState, useCallback } from 'react';
import type {
  Review,
  ModerationReason,
  UseReviewActionsReturn,
} from '../types/reviews.types';
import {
  approveReview,
  rejectReview,
  respondToReview,
  deleteReview,
} from '../shared/reviews.api';

export function useReviewActions(): UseReviewActionsReturn {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const clearError = useCallback(() => setActionError(null), []);

  const approve = useCallback(
    async (id: string, onSuccess: (updated: Review) => void) => {
      setLoadingId(id);
      setActionError(null);
      try {
        const updated = await approveReview(id);
        onSuccess(updated);
      } catch {
        setActionError(id);
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
      setActionError(null);
      try {
        const updated = await rejectReview(id, { reason, notes });
        onSuccess(updated);
      } catch {
        setActionError(id);
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

  const remove = useCallback(
    async (
      id: string,
      reason: ModerationReason,
      detail: string | undefined,
      onSuccess: () => void
    ) => {
      setLoadingId(id);
      setActionError(null);
      try {
        await deleteReview(id, { reason, detail });
        onSuccess();
      } catch {
        setActionError(id);
      } finally {
        setLoadingId(null);
      }
    },
    []
  );

  return { approve, reject, respond, remove, loadingId, actionError, clearError };
}

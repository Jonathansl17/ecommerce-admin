'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Review, ReviewStatus } from '../types/reviews.types';
import { getReviews } from '../shared/reviews.api';

type StatusFilter = ReviewStatus | 'all';

interface UseReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  refetch: () => void;
}

export function useReviews(): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [fetchTick, setFetchTick] = useState(0);

  const refetch = useCallback(() => {
    setFetchTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getReviews(
          statusFilter === 'all' ? undefined : statusFilter
        );
        if (!cancelled) setReviews(data);
      } catch {
        if (!cancelled) setError('fetch_error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, fetchTick]);

  return { reviews, isLoading, error, statusFilter, setStatusFilter, refetch };
}

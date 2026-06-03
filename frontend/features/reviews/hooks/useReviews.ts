'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Review,
  ReviewStats,
  ReviewStatusFilter,
  UseReviewsReturn,
} from '../types/reviews.types';
import { getReviews, getReviewStats } from '../shared/reviews.api';
import {
  EMPTY_REVIEW_STATS,
  REVIEW_STATUS_FILTER_ALL,
  REVIEWS_PAGE_SIZE,
} from '../constants/reviews.constants';

export function useReviews(): UseReviewsReturn {
  const pageSize = REVIEWS_PAGE_SIZE;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>(EMPTY_REVIEW_STATS);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilterState] = useState<ReviewStatusFilter>('all');
  const [fetchTick, setFetchTick] = useState(0);

  const refetch = useCallback(() => setFetchTick((t) => t + 1), []);

  // Changing the filter always returns to the first page.
  const setStatusFilter = useCallback((filter: ReviewStatusFilter) => {
    setStatusFilterState(filter);
    setPage(1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [list, statsResult] = await Promise.all([
          getReviews({
            status: statusFilter === REVIEW_STATUS_FILTER_ALL ? undefined : statusFilter,
            page,
            pageSize,
          }),
          getReviewStats(),
        ]);
        if (cancelled) return;

        // If the page fell out of range (e.g. after deleting the last item on
        // the last page), step back to the last valid page and let it refetch.
        const maxPage = Math.max(1, Math.ceil(list.total / pageSize));
        if (page > maxPage) {
          setPage(maxPage);
          return;
        }

        setReviews(list.items);
        setTotal(list.total);
        setStats(statsResult);
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
  }, [statusFilter, page, pageSize, fetchTick]);

  return {
    reviews,
    stats,
    total,
    page,
    pageSize,
    setPage,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    refetch,
  };
}

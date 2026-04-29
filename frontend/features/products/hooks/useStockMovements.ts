import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_MOVEMENT_PAGINATION } from '../constants/stock-movement';
import type {
  StockMovement,
  StockMovementFilters,
  StockMovementPagination,
  StockMovementResponse,
} from '../types/stock-movement';

export function useStockMovements(productId: string) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<StockMovementPagination>({
    page: 1,
    limit: STOCK_MOVEMENT_PAGINATION.DEFAULT_LIMIT,
    total: 0,
  });
  const activeFiltersRef = useRef<StockMovementFilters>({
    page: 1,
    limit: STOCK_MOVEMENT_PAGINATION.DEFAULT_LIMIT,
  });

  const fetchMovements = useCallback(
    async (newFilters?: StockMovementFilters) => {
      if (newFilters !== undefined) activeFiltersRef.current = newFilters;

      const f = activeFiltersRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', String(f.page ?? 1));
        params.set('limit', String(f.limit ?? STOCK_MOVEMENT_PAGINATION.DEFAULT_LIMIT));
        if (f.reason) params.set('reason', f.reason);
        if (f.startDate) params.set('startDate', f.startDate);
        if (f.endDate) params.set('endDate', f.endDate);

        const data = await apiFetch<StockMovementResponse>(
          `${PRODUCTS_API.MOVEMENTS(productId)}?${params}`,
          { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
        );

        setMovements(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : PRODUCTS_MESSAGES.history.errorLoading);
      } finally {
        setIsLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  return { movements, isLoading, error, pagination, refetch: fetchMovements };
}

import { useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { BulkAdjustStockRequest, BulkAdjustStockResponse } from '../types/products.types';

export function useBulkAdjustStock(onSuccess?: (response: BulkAdjustStockResponse) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkAdjust = useCallback(
    async (request: BulkAdjustStockRequest): Promise<BulkAdjustStockResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFetch<BulkAdjustStockResponse>(PRODUCTS_API.BULK_ADJUST_STOCK, {
          method: 'POST',
          body: request as unknown as Record<string, unknown>,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        onSuccess?.(data);
        return data;
      } catch (err: unknown) {
        const apiErr =
          err instanceof ApiError
            ? ((err.body ?? {}) as { error?: string })
            : (err as { error?: string });
        setError(apiErr?.error ?? PRODUCTS_MESSAGES.errors.bulkAdjustError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  return { bulkAdjust, isLoading, error };
}

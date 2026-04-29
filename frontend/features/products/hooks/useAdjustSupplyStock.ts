import { useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { AdjustStockForm, Product } from '../types/products.types';

export function useAdjustSupplyStock(onSuccess?: (updated: Product) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = useCallback(
    async (productId: string, data: AdjustStockForm): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const body = await apiFetch<{ data: Product }>(PRODUCTS_API.ADJUST_STOCK(productId), {
          method: 'POST',
          body: data as unknown as Record<string, unknown>,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        onSuccess?.(body.data);
      } catch (err: unknown) {
        const apiErr =
          err instanceof ApiError
            ? ((err.body ?? {}) as { error?: string })
            : (err as { error?: string });
        setError(
          apiErr?.error === PRODUCTS_MESSAGES.errors.sameStockError
            ? PRODUCTS_MESSAGES.errors.sameStockError
            : PRODUCTS_MESSAGES.errors.adjustError
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  return { adjustStock, isLoading, error };
}

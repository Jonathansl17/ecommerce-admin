import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { BulkAdjustStockRequest, BulkAdjustStockResponse } from '../types/products.types';

export function useBulkAdjustStock(onSuccess?: (response: BulkAdjustStockResponse) => void) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkAdjust = useCallback(
    async (request: BulkAdjustStockRequest): Promise<BulkAdjustStockResponse | null> => {
      if (!token) return null;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}${PRODUCTS_API.BULK_ADJUST_STOCK}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw body;
        }

        const data: BulkAdjustStockResponse = await res.json();
        onSuccess?.(data);
        return data;
      } catch (err: unknown) {
        const apiErr = err as { error?: string };
        setError(apiErr?.error ?? PRODUCTS_MESSAGES.errors.bulkAdjustError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token, onSuccess]
  );

  return { bulkAdjust, isLoading, error };
}

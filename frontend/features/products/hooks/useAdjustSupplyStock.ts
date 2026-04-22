import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { AdjustStockForm } from '../types/products.types';
import type { Supply } from '@/lib/types/inventory.types';

export function useAdjustSupplyStock(onSuccess?: (updated: Supply) => void) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = useCallback(
    async (id: string, data: AdjustStockForm): Promise<void> => {
      if (!token) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}${PRODUCTS_API.ADJUST_STOCK(id)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw body;
        }

        const body: { data: Supply } = await res.json();
        onSuccess?.(body.data);
      } catch (err: unknown) {
        const apiErr = err as { error?: string };
        setError(
          apiErr?.error === PRODUCTS_MESSAGES.errors.sameStockError
            ? PRODUCTS_MESSAGES.errors.sameStockError
            : PRODUCTS_MESSAGES.errors.adjustError
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, onSuccess]
  );

  return { adjustStock, isLoading, error };
}

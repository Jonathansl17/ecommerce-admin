import { useState, useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { CUSTOM_ORDERS_API } from '../constants/api';
import { CUSTOM_ORDERS_MESSAGES } from '../constants/messages';
import type { CustomOrder, UseUpdateCustomOrderStatusResult } from '../models/custom-orders.models';
import type { CustomOrderStatus } from '../types/custom-orders.types';

const HTTP_CONFLICT = 409;
const HTTP_NOT_FOUND = 404;

interface UseUpdateCustomOrderStatusOptions {
  onSuccess?: (updated: CustomOrder) => void;
  onError?: (message: string) => void;
}

export function useUpdateCustomOrderStatus(
  options: UseUpdateCustomOrderStatusOptions = {},
): UseUpdateCustomOrderStatusResult {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (orderId: string, newStatus: CustomOrderStatus) => {
      setUpdatingId(orderId);
      setError(null);
      try {
        const updated = await apiFetch<CustomOrder>(CUSTOM_ORDERS_API.UPDATE_STATUS(orderId), {
          method: 'PATCH',
          body: { status: newStatus } as Record<string, unknown>,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        options.onSuccess?.(updated);
      } catch (err) {
        let message: string = CUSTOM_ORDERS_MESSAGES.errors.networkError;
        if (err instanceof ApiError) {
          if (err.status === HTTP_CONFLICT) {
            message = CUSTOM_ORDERS_MESSAGES.errors.stockInsuficiente;
          } else if (err.status === HTTP_NOT_FOUND) {
            message = CUSTOM_ORDERS_MESSAGES.errors.notFound;
          }
        }
        setError(message);
        options.onError?.(message);
      } finally {
        setUpdatingId(null);
      }
    },
    [options],
  );

  return { updateStatus, updatingId, error };
}

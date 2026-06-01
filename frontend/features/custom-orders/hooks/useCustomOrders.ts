import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { CUSTOM_ORDERS_API } from '../constants/api';
import { CUSTOM_ORDERS_MESSAGES } from '../constants/messages';
import { groupOrdersByStatus } from '../shared/utils';
import type { CustomOrder, KanbanColumnData, UseCustomOrdersResult } from '../models/custom-orders.models';

export function useCustomOrders(): UseCustomOrdersResult {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<CustomOrder[]>(CUSTOM_ORDERS_API.GET_ALL, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      setOrders(data ?? []);
    } catch {
      setError(CUSTOM_ORDERS_MESSAGES.errors.fetch);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: KanbanColumnData[] = groupOrdersByStatus(orders);

  return { columns, isLoading, error, refetch: fetchOrders };
}

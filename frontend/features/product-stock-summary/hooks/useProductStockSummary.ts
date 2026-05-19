'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { buildProductAlerts } from '@/features/stock-alerts/shared/utils';
import type { Product } from '@/features/products/types/products.types';
import type { UseProductStockSummaryResult, StockSummaryItem } from '../types/product-stock-summary.types';
import { STOCK_SUMMARY_API, STOCK_SUMMARY_POLL_INTERVAL_MS } from '../constants/api';
import { STOCK_SUMMARY_MESSAGES } from '../constants/messages';

export const useProductStockSummary = (): UseProductStockSummaryResult => {
  const [items, setItems] = useState<StockSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSummary = useCallback(async () => {
    setError(null);
    try {
      const products = await apiFetch<Product[]>(STOCK_SUMMARY_API.GET_PRODUCTS, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      setItems(buildProductAlerts(products) as StockSummaryItem[]);
    } catch {
      setError(STOCK_SUMMARY_MESSAGES.errorFetch);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    intervalRef.current = setInterval(fetchSummary, STOCK_SUMMARY_POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchSummary]);

  const outOfStockCount = items.filter((i) => i.severity === 'out_of_stock').length;
  const lowStockCount = items.filter((i) => i.severity === 'low_stock').length;

  return { items, outOfStockCount, lowStockCount, isLoading, error, refresh: fetchSummary };
};

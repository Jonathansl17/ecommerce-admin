'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { INVENTORY_REPORT_API, INVENTORY_REPORT_TIMEOUT_MS } from '../constants/api';
import { INVENTORY_REPORT_MESSAGES } from '../constants/messages';
import { INITIAL_FILTERS } from '../constants/filters';
import { buildReportRows, filterRows, partitionRowsByCustomizable } from '../shared/utils';
import type {
  InventoryProduct,
  InventoryReportFilters,
  StockStatus,
  UseProductInventoryReportResult,
} from '../models/product-inventory-report.models';

export const useProductInventoryReport = (): UseProductInventoryReportResult => {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryReportFilters>(INITIAL_FILTERS);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<InventoryProduct[]>(INVENTORY_REPORT_API.GET_PRODUCTS, {
        signal: AbortSignal.timeout(INVENTORY_REPORT_TIMEOUT_MS),
      });
      setProducts(data);
    } catch {
      setError(INVENTORY_REPORT_MESSAGES.fetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const allRows = useMemo(() => buildReportRows(products), [products]);

  const filteredRows = useMemo(() => filterRows(allRows, filters), [allRows, filters]);

  const { standardRows, customRows } = useMemo(
    () => partitionRowsByCustomizable(filteredRows),
    [filteredRows]
  );

  const setSearch = useCallback(
    (search: string) => setFilters((prev) => ({ ...prev, search })),
    []
  );

  const setStockStatus = useCallback(
    (stockStatus: StockStatus) => setFilters((prev) => ({ ...prev, stockStatus })),
    []
  );

  return {
    standardRows,
    customRows,
    isLoading,
    error,
    filters,
    setSearch,
    setStockStatus,
    refetch: fetchProducts,
  };
};

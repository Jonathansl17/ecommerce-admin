'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import { getSupplyMovements } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { SupplyHistory, PaginationMeta, MovementTypeFilter } from '@/lib/types/inventory.types';

export function useSupplyHistory(supplyId: string) {
  const [history, setHistory] = useState<SupplyHistory | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<MovementTypeFilter>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const loadMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const result = await getSupplyMovements(supplyId, {
        type: typeFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
      });
      setHistory(result.data);
      setMeta(result.meta);
    } catch {
      setFetchError(INVENTORY_STRINGS.errors.historyError);
    } finally {
      setIsLoading(false);
    }
  }, [supplyId, typeFilter, dateFrom, dateTo, page]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const handleFilterChange = <T extends string>(setter: Dispatch<SetStateAction<T>>) => (value: T) => {
    setPage(1);
    setter(value);
  };

  return {
    history,
    meta,
    fetchError,
    isLoading,
    typeFilter,
    setTypeFilter: handleFilterChange(setTypeFilter),
    dateFrom,
    setDateFrom: handleFilterChange(setDateFrom),
    dateTo,
    setDateTo: handleFilterChange(setDateTo),
    page,
    setPage,
  };
}

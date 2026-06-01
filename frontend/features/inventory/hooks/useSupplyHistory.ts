'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupplyMovements } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { SupplyHistory, MovementTypeFilter } from '@/lib/types/inventory.types';

export function useSupplyHistory(supplyId: string) {
  const [history, setHistory] = useState<SupplyHistory | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<MovementTypeFilter>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const data = await getSupplyMovements(supplyId, {
        type: typeFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setHistory(data);
    } catch {
      setFetchError(INVENTORY_STRINGS.errors.historyError);
    } finally {
      setIsLoading(false);
    }
  }, [supplyId, typeFilter, dateFrom, dateTo]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return {
    history,
    fetchError,
    isLoading,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  };
}

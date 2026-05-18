import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrders } from '../api/orders.api';
import { DEFAULT_LIMIT } from '../constants/orders.constants';
import { toFetchListError } from '../utils/orders-error.utils';
import type { AdminOrder, OrderFilters } from '../types/orders.types';

interface UseOrdersState {
  pedidos: AdminOrder[];
  total: number;
  cargando: boolean;
  error: string | null;
}

interface UseOrdersReturn extends UseOrdersState {
  recargar: () => void;
  setFilters: (filters: OrderFilters) => void;
}

export function useOrders(initialFilters: OrderFilters = {}): UseOrdersReturn {
  const [state, setState] = useState<UseOrdersState>({
    pedidos: [],
    total: 0,
    cargando: true,
    error: null,
  });

  const filtersRef = useRef<OrderFilters>({
    limit: DEFAULT_LIMIT,
    offset: 0,
    ...initialFilters,
  });

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, cargando: true, error: null }));

    fetchOrders(filtersRef.current, { signal: controller.signal })
      .then((data) => {
        setState({ pedidos: data.items, total: data.total, cargando: false, error: null });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setState((prev) => ({
          ...prev,
          cargando: false,
          error: toFetchListError(err),
        }));
      });
  }, []);

  useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const setFilters = useCallback(
    (filters: OrderFilters) => {
      filtersRef.current = { ...filtersRef.current, ...filters };
      load();
    },
    [load],
  );

  return {
    pedidos: state.pedidos,
    total: state.total,
    cargando: state.cargando,
    error: state.error,
    recargar: load,
    setFilters,
  };
}

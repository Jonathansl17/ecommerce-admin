import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrder } from '../api/orders.api';
import { toFetchDetailError } from '../utils/orders-error.utils';
import type { AdminOrder } from '../types/orders.types';

interface UseOrderDetailReturn {
  pedido: AdminOrder | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
  setPedido: (order: AdminOrder) => void;
}

export function useOrderDetail(id: string): UseOrderDetailReturn {
  const [pedido, setPedido] = useState<AdminOrder | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setCargando(true);
    setError(null);

    fetchOrder(id, { signal: controller.signal })
      .then((data) => {
        setPedido(data);
        setCargando(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(toFetchDetailError(err));
        setCargando(false);
      });
  }, [id]);

  useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  return { pedido, cargando, error, recargar: load, setPedido };
}

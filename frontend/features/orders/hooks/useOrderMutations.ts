import { useState } from 'react';
import { updateOrderStatus, cancelOrder, approvePayment } from '../api/orders.api';
import { toUpdateStatusError, toCancelError, toApprovePaymentError } from '../utils/orders-error.utils';
import type { AdminOrder, OrderStatus, UseOrderMutationsReturn } from '../types/orders.types';

export function useOrderMutations(): UseOrderMutationsReturn {
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarEstado = async (
    id: string,
    status: OrderStatus,
  ): Promise<AdminOrder | null> => {
    setEjecutando(true);
    setError(null);
    try {
      const updated = await updateOrderStatus(id, status);
      return updated;
    } catch (err: unknown) {
      setError(toUpdateStatusError(err));
      return null;
    } finally {
      setEjecutando(false);
    }
  };

  const cancelar = async (id: string): Promise<AdminOrder | null> => {
    setEjecutando(true);
    setError(null);
    try {
      const cancelled = await cancelOrder(id);
      return cancelled;
    } catch (err: unknown) {
      setError(toCancelError(err));
      return null;
    } finally {
      setEjecutando(false);
    }
  };

  const aprobarPago = async (id: string, paymentId: string): Promise<boolean> => {
    setEjecutando(true);
    setError(null);
    try {
      await approvePayment(id, paymentId);
      return true;
    } catch (err: unknown) {
      setError(toApprovePaymentError(err));
      return false;
    } finally {
      setEjecutando(false);
    }
  };

  return { ejecutando, error, actualizarEstado, cancelar, aprobarPago };
}

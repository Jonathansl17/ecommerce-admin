'use client';

import { useState, useCallback } from 'react';
import { CUSTOM_ORDERS_MESSAGES } from '../constants/messages';
import { KANBAN_BOARD_STYLES } from '../constants/styles';
import { KANBAN_COLUMN_ORDER } from '../shared/utils';
import { KanbanColumn } from './KanbanColumn';
import { useCustomOrders } from '../hooks/useCustomOrders';
import { useUpdateCustomOrderStatus } from '../hooks/useUpdateCustomOrderStatus';
import type { CustomOrder, KanbanColumnData } from '../models/custom-orders.models';
import type { CustomOrderStatus } from '../types/custom-orders.types';

const strings = CUSTOM_ORDERS_MESSAGES;

export function KanbanBoard() {
  const { columns: fetchedColumns, isLoading, error, refetch } = useCustomOrders();
  const [localColumns, setLocalColumns] = useState<KanbanColumnData[] | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const columns = localColumns ?? fetchedColumns;

  const applyOptimisticMove = useCallback(
    (orderId: string, newStatus: CustomOrderStatus) => {
      setLocalColumns((prev) => {
        const source = prev ?? fetchedColumns;
        let movedOrder: CustomOrder | undefined;

        const updated = source.map((col) => {
          const without = col.orders.filter((o) => {
            if (o.id === orderId) { movedOrder = o; return false; }
            return true;
          });
          return { ...col, orders: without };
        });

        if (!movedOrder) return source;
        const withMoved = updated.map((col) =>
          col.status === newStatus
            ? { ...col, orders: [{ ...movedOrder!, status: newStatus }, ...col.orders] }
            : col,
        );
        return withMoved;
      });
    },
    [fetchedColumns],
  );

  const { updateStatus, updatingId } = useUpdateCustomOrderStatus({
    onSuccess: () => {
      setLocalColumns(null);
      refetch();
    },
    onError: (message) => {
      setLocalColumns(null);
      setToastError(message);
      setTimeout(() => setToastError(null), 4000);
    },
  });

  const handleMoveOrder = useCallback(
    (orderId: string, newStatus: CustomOrderStatus) => {
      applyOptimisticMove(orderId, newStatus);
      updateStatus(orderId, newStatus);
    },
    [applyOptimisticMove, updateStatus],
  );

  if (isLoading) {
    return <p className="text-sm text-foreground/60">{strings.board.loading}</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-sm text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-foreground/60 underline hover:text-foreground transition-colors"
        >
          {strings.errors.unknown}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toastError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700"
        >
          {toastError}
        </div>
      )}

      <div className={KANBAN_BOARD_STYLES.wrapper}>
        <div className={KANBAN_BOARD_STYLES.grid}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.status}
              column={col}
              availableStatuses={KANBAN_COLUMN_ORDER}
              onDrop={handleMoveOrder}
              onMoveToStatus={handleMoveOrder}
              updatingId={updatingId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

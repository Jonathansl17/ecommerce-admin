import { useState } from 'react';
import { CUSTOM_ORDERS_MESSAGES } from '../constants/messages';
import { KANBAN_COLUMN_STYLES } from '../constants/styles';
import { KanbanCard } from './KanbanCard';
import type { KanbanColumnProps } from '../models/custom-orders.models';
import type { CustomOrderStatus } from '../types/custom-orders.types';

const strings = CUSTOM_ORDERS_MESSAGES.board;

export function KanbanColumn({ column, onDrop, onMoveToStatus, updatingId }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const orderId = e.dataTransfer.getData('orderId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus') as CustomOrderStatus;
    if (orderId && sourceStatus !== column.status) {
      onDrop(orderId, column.status);
    }
  };

  const columnClass = [
    KANBAN_COLUMN_STYLES.base,
    isDragOver ? KANBAN_COLUMN_STYLES.dragOver : '',
  ].join(' ');

  return (
    <section
      role="region"
      aria-label={column.label}
      className={columnClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={KANBAN_COLUMN_STYLES.header}>
        <span className={KANBAN_COLUMN_STYLES.title}>{column.label}</span>
        <span className={KANBAN_COLUMN_STYLES.counter}>{column.orders.length}</span>
      </div>

      <div className={KANBAN_COLUMN_STYLES.body}>
        {column.orders.length === 0 ? (
          <p className={KANBAN_COLUMN_STYLES.emptyLabel}>{strings.emptyColumn}</p>
        ) : (
          column.orders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              onMoveToStatus={onMoveToStatus}
              isUpdating={updatingId === order.id}
            />
          ))
        )}
      </div>
    </section>
  );
}

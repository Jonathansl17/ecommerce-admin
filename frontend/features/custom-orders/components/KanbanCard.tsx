import { CUSTOM_ORDERS_MESSAGES, CUSTOM_ORDER_STATUS_LABELS } from '../constants/messages';
import { KANBAN_CARD_STYLES, STATUS_BADGE_STYLES } from '../constants/styles';
import { KANBAN_COLUMN_ORDER, formatOrderDate, getClientName, getOrderDescription } from '../shared/utils';
import type { KanbanCardProps } from '../models/custom-orders.models';
import type { CustomOrderStatus } from '../types/custom-orders.types';

const strings = CUSTOM_ORDERS_MESSAGES.card;

export function KanbanCard({ order, onMoveToStatus, isUpdating }: KanbanCardProps) {
  const clientName = getClientName(order);
  const description = getOrderDescription(order);
  const availableTargets = KANBAN_COLUMN_ORDER.filter((s) => s !== order.status);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('orderId', order.id);
    e.dataTransfer.setData('sourceStatus', order.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleMoveSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target.value as CustomOrderStatus;
    if (target) onMoveToStatus(order.id, target);
    e.target.value = '';
  };

  return (
    <article
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      className={KANBAN_CARD_STYLES.base}
      aria-label={`Pedido ${order.id} — ${CUSTOM_ORDER_STATUS_LABELS[order.status]}`}
    >
      <p className={KANBAN_CARD_STYLES.productName}>
        {order.product?.name ?? `Producto #${order.productId}`}
      </p>

      {clientName && (
        <p className={KANBAN_CARD_STYLES.clientName}>
          {strings.client}: {clientName}
        </p>
      )}

      {description && (
        <p className={KANBAN_CARD_STYLES.details}>{description}</p>
      )}

      <p className={KANBAN_CARD_STYLES.date}>
        {strings.createdAt} {formatOrderDate(order.createdAt)}
      </p>

      <div className={KANBAN_CARD_STYLES.footer}>
        <span className={`${KANBAN_CARD_STYLES.badge} ${STATUS_BADGE_STYLES[order.status]}`}>
          {CUSTOM_ORDER_STATUS_LABELS[order.status]}
        </span>

        {isUpdating ? (
          <span className={KANBAN_CARD_STYLES.updatingLabel}>{strings.updating}</span>
        ) : (
          <select
            className={KANBAN_CARD_STYLES.moveSelect}
            defaultValue=""
            onChange={handleMoveSelect}
            aria-label={`${strings.moveTo} — pedido ${order.id}`}
          >
            <option value="" disabled>{strings.moveTo}</option>
            {availableTargets.map((s) => (
              <option key={s} value={s}>
                {CUSTOM_ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}

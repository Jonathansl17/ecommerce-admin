'use client';

import { useState } from 'react';
import { formatDate, formatTime } from '../shared/formatters';
import { calculateMovementDifference, formatMovementSign } from '../shared/utils';
import {
  STOCK_MOVEMENT_REASON_LABELS,
  STOCK_MOVEMENT_REASON_COLORS,
} from '../constants/stock-movement';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { StockMovement } from '../types/stock-movement';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementRowProps {
  movement: StockMovement;
}

export function StockMovementRow({ movement }: StockMovementRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difference = calculateMovementDifference(movement.previousQuantity, movement.newQuantity);
  const isIncrease = difference >= 0;
  const reasonLabel = movement.reason ? STOCK_MOVEMENT_REASON_LABELS[movement.reason] : '—';
  const reasonColor = movement.reason ? STOCK_MOVEMENT_REASON_COLORS[movement.reason] : 'bg-gray-100 text-gray-600';

  return (
    <>
      <tr
        onClick={() => setIsExpanded((prev) => !prev)}
        className="hover:bg-foreground/5 cursor-pointer transition-colors"
      >
        <td className="px-4 py-3 text-foreground/70 whitespace-nowrap">
          {formatDate(movement.createdAt)}&nbsp;{formatTime(movement.createdAt)}
        </td>
        <td className="px-4 py-3 font-medium text-foreground">{movement.previousQuantity}</td>
        <td className="px-4 py-3 font-medium text-foreground">{movement.newQuantity}</td>
        <td className={`px-4 py-3 font-semibold ${isIncrease ? 'text-success' : 'text-destructive'}`}>
          {formatMovementSign(difference)}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${reasonColor}`}>
            {reasonLabel}
          </span>
        </td>
        <td className="px-4 py-3 text-foreground/70">{movement.admin.adminUser.fullName}</td>
      </tr>

      {isExpanded && (
        <tr className="bg-foreground/5">
          <td colSpan={6} className="px-4 py-3 text-sm text-foreground/70">
            <strong>{strings.expandNotes}</strong>{' '}
            {movement.note ?? <span className="italic">Sin notas adicionales.</span>}
          </td>
        </tr>
      )}
    </>
  );
}

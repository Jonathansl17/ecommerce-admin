'use client';

import { Modal } from '@/components/ui/Modal';
import { StockMovementHistory } from './StockMovementHistory';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Supply } from '@/lib/types/inventory.types';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementHistoryModalProps {
  supply: Supply | null;
  refreshKey: number;
  onClose: () => void;
}

export function StockMovementHistoryModal({ supply, refreshKey, onClose }: StockMovementHistoryModalProps) {
  if (!supply) return null;

  return (
    <Modal
      titleId="history-modal-title"
      title={`${strings.title} — ${supply.name}`}
      description={strings.subtitle}
      onClose={onClose}
      size="lg"
    >
      <StockMovementHistory supply={supply} refreshKey={refreshKey} />
    </Modal>
  );
}

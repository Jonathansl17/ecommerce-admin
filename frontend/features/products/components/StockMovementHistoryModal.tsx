'use client';

import { Modal } from '@/components/ui/Modal';
import { StockMovementHistory } from './StockMovementHistory';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { ProductVariant } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementHistoryModalProps {
  variant: ProductVariant | null;
  productName?: string;
  refreshKey: number;
  onClose: () => void;
}

export function StockMovementHistoryModal({
  variant,
  productName,
  refreshKey,
  onClose,
}: StockMovementHistoryModalProps) {
  if (!variant) return null;

  const modalTitle = productName
    ? `${strings.title} — ${productName} / ${variant.name}`
    : `${strings.title} — ${variant.name}`;

  return (
    <Modal
      titleId="history-modal-title"
      title={modalTitle}
      description={strings.subtitle}
      onClose={onClose}
      size="lg"
    >
      <StockMovementHistory variant={variant} refreshKey={refreshKey} />
    </Modal>
  );
}

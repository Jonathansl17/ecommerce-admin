'use client';

import { Modal } from '@/components/ui/Modal';
import { StockMovementHistory } from './StockMovementHistory';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Product } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementHistoryModalProps {
  product: Product | null;
  refreshKey: number;
  onClose: () => void;
}

export function StockMovementHistoryModal({
  product,
  refreshKey,
  onClose,
}: StockMovementHistoryModalProps) {
  if (!product) return null;

  return (
    <Modal
      titleId="history-modal-title"
      title={`${strings.title} — ${product.name}`}
      description={strings.subtitle}
      onClose={onClose}
      size="lg"
    >
      <StockMovementHistory product={product} refreshKey={refreshKey} />
    </Modal>
  );
}

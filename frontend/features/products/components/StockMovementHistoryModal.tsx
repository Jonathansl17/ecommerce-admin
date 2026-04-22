'use client';

import { StockMovementHistory } from './StockMovementHistory';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Supply } from '@/lib/types/inventory.types';

const strings = PRODUCTS_MESSAGES.history;

interface StockMovementHistoryModalProps {
  supply: Supply | null;
  refreshKey: number;
  onClose: () => void;
}

export function StockMovementHistoryModal({
  supply,
  refreshKey,
  onClose,
}: StockMovementHistoryModalProps) {
  if (!supply) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-foreground/10 bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="history-modal-title" className="text-base font-semibold text-foreground">
              {strings.title} — {supply.name}
            </h2>
            <p className="mt-0.5 text-sm text-foreground/60">{strings.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <StockMovementHistory supply={supply} refreshKey={refreshKey} />
      </div>
    </div>
  );
}

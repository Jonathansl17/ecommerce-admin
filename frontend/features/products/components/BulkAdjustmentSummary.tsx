import { Button } from '@/components/ui/Button';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { BulkAdjustStockResponse } from '../types/products.types';

interface BulkAdjustmentSummaryProps {
  summary: BulkAdjustStockResponse;
  onClose: () => void;
}

export function BulkAdjustmentSummary({ summary, onClose }: BulkAdjustmentSummaryProps) {
  const strings = PRODUCTS_MESSAGES.bulk;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-base font-semibold text-foreground mb-4">{strings.summaryTitle}</h2>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 rounded-lg bg-success/15 border border-success/30 p-3 text-center">
            <p className="text-2xl font-bold text-success">
              {summary.summary.successful}
            </p>
            <p className="text-xs text-success">Exitosos</p>
          </div>
          {summary.summary.failed > 0 && (
            <div className="flex-1 rounded-lg bg-destructive/15 border border-destructive/30 p-3 text-center">
              <p className="text-2xl font-bold text-destructive">
                {summary.summary.failed}
              </p>
              <p className="text-xs text-destructive">Fallidos</p>
            </div>
          )}
        </div>

        {summary.summary.failed > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-destructive mb-2">
              Productos que fallaron:
            </p>
            <ul className="space-y-1">
              {summary.results
                .filter((r) => !r.success)
                .map((r) => (
                  <li key={r.productId} className="text-xs text-destructive">
                    • ID {r.productId}: {r.error}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <Button onClick={onClose} fullWidth>
          {strings.summaryClose}
        </Button>
      </div>
    </div>
  );
}

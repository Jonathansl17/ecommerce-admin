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
          <div className="flex-1 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {summary.summary.successful}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">Exitosos</p>
          </div>
          {summary.summary.failed > 0 && (
            <div className="flex-1 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-center">
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {summary.summary.failed}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500">Fallidos</p>
            </div>
          )}
        </div>

        {summary.summary.failed > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
              Productos que fallaron:
            </p>
            <ul className="space-y-1">
              {summary.results
                .filter((r) => !r.success)
                .map((r) => (
                  <li key={r.productId} className="text-xs text-red-600 dark:text-red-400">
                    • ID {r.productId}: {r.error}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          {strings.summaryClose}
        </button>
      </div>
    </div>
  );
}

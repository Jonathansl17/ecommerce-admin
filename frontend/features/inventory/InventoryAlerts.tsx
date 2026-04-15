import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from './inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.alerts;

interface InventoryAlertsProps {
  supplies: Supply[];
  onQuickEntry: (supplyId: string) => void;
}

interface AlertRowProps {
  supply: Supply;
  variant: 'out_of_stock' | 'low_stock';
  onQuickEntry: (supplyId: string) => void;
}

function AlertRow({ supply, variant, onQuickEntry }: AlertRowProps) {
  const isOut = variant === 'out_of_stock';

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${isOut ? 'text-red-800' : 'text-yellow-900'}`}>
          {supply.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-red-500' : 'text-yellow-600'}`}>
          {strings.stockLabel}: {Number(supply.currentStock)}{' '}
          {UNIT_OF_MEASURE_LABELS[supply.unitOfMeasure]} · {strings.thresholdLabel}:{' '}
          {Number(supply.minThreshold)}
        </p>
      </div>
      <button
        onClick={() => onQuickEntry(supply.id)}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-red-300 text-red-700 hover:bg-red-100'
            : 'border-yellow-400 text-yellow-800 hover:bg-yellow-100'
        }`}
      >
        {strings.registerEntryButton}
      </button>
    </li>
  );
}

export function InventoryAlerts({ supplies, onQuickEntry }: InventoryAlertsProps) {
  const outOfStock = supplies.filter(
    (s) => Number(s.minThreshold) > 0 && Number(s.currentStock) <= 0
  );
  const lowStock = supplies.filter(
    (s) =>
      Number(s.minThreshold) > 0 &&
      Number(s.currentStock) > 0 &&
      Number(s.currentStock) <= Number(s.minThreshold)
  );

  if (outOfStock.length === 0 && lowStock.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground/70">{strings.sectionTitle}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {outOfStock.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                {strings.outOfStock} ({outOfStock.length})
              </p>
            </div>
            <ul className="space-y-3">
              {outOfStock.map((s) => (
                <AlertRow key={s.id} supply={s} variant="out_of_stock" onQuickEntry={onQuickEntry} />
              ))}
            </ul>
          </div>
        )}

        {lowStock.length > 0 && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                {strings.lowStock} ({lowStock.length})
              </p>
            </div>
            <ul className="space-y-3">
              {lowStock.map((s) => (
                <AlertRow key={s.id} supply={s} variant="low_stock" onQuickEntry={onQuickEntry} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

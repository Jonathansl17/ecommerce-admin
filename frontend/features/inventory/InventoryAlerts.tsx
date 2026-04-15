import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from './inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.alerts;

interface InventoryAlertsProps {
  supplies: Supply[];
}

export function InventoryAlerts({ supplies }: InventoryAlertsProps) {
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

      {outOfStock.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
            {strings.outOfStock}
          </p>
          <ul className="space-y-1">
            {outOfStock.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm text-red-700">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-red-500">
                  {strings.stockLabel}: {Number(s.currentStock)}{' '}
                  {UNIT_OF_MEASURE_LABELS[s.unitOfMeasure]} / {strings.thresholdLabel}:{' '}
                  {Number(s.minThreshold)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-yellow-700">
            {strings.lowStock}
          </p>
          <ul className="space-y-1">
            {lowStock.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm text-yellow-800">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-yellow-600">
                  {strings.stockLabel}: {Number(s.currentStock)}{' '}
                  {UNIT_OF_MEASURE_LABELS[s.unitOfMeasure]} / {strings.thresholdLabel}:{' '}
                  {Number(s.minThreshold)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

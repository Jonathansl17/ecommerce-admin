import { StatusDot } from '@/components/ui/StatusDot';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '../constants/inventory.constants';
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
  const unit = UNIT_OF_MEASURE_LABELS[supply.unitOfMeasure];
  const avgLabel =
    supply.avgDailySales != null
      ? `${supply.avgDailySales.toFixed(2)} ${unit}/día`
      : strings.daysRemainingUnknown;
  const daysLabel =
    supply.daysRemaining != null
      ? `${supply.daysRemaining} días`
      : strings.daysRemainingUnknown;

  return (
    <li className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isOut ? 'text-destructive' : 'text-warning-foreground'}`}>
          {supply.name}
        </p>
        <p className={`text-xs ${isOut ? 'text-destructive/80' : 'text-warning-foreground/80'}`}>
          {strings.stockLabel}: {Number(supply.currentStock)}{' '}
          {unit} · {strings.thresholdLabel}:{' '}
          {Number(supply.minThreshold)}
        </p>
        <p className={`text-xs mt-0.5 ${isOut ? 'text-destructive/70' : 'text-warning-foreground/70'}`}>
          {strings.avgDailySalesLabel}: {avgLabel} · {strings.daysRemainingLabel}: {daysLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onQuickEntry(supply.id)}
        className={`shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
          isOut
            ? 'border-destructive/40 text-destructive hover:bg-destructive/15'
            : 'border-warning/50 text-warning-foreground hover:bg-warning/20'
        }`}
      >
        {strings.registerEntryButton}
      </button>
    </li>
  );
}

export function InventoryAlerts({ supplies, onQuickEntry }: InventoryAlertsProps) {
  const outOfStock = supplies.filter(
    (s) => Number(s.currentStock) <= 0
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
          <div className="rounded-lg border border-destructive/20 bg-destructive/15 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <StatusDot tone="danger" />
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
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
          <div className="rounded-lg border border-warning/30 bg-warning/20 px-4 py-3">
            <div className="mb-3 flex items-center gap-2">
              <StatusDot tone="warning" />
              <p className="text-xs font-semibold uppercase tracking-wide text-warning-foreground">
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

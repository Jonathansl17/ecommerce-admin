import { PRODUCTS_MESSAGES } from '../constants/messages';
import { UNIT_OF_MEASURE_LABELS } from '@/features/inventory/inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

const strings = PRODUCTS_MESSAGES.list;

interface ProductListProps {
  supplies: Supply[];
  onAdjust: (supply: Supply) => void;
}

export function ProductList({ supplies, onAdjust }: ProductListProps) {
  if (supplies.length === 0) {
    return <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left text-foreground/70">
          <tr>
            <th className="px-4 py-3 font-medium">{strings.colName}</th>
            <th className="px-4 py-3 font-medium">{strings.colUnit}</th>
            <th className="px-4 py-3 font-medium">{strings.colStock}</th>
            <th className="px-4 py-3 font-medium">{strings.colStatus}</th>
            <th className="px-4 py-3 font-medium">{strings.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {supplies.map((supply) => (
            <tr key={supply.id} className="hover:bg-foreground/5 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{supply.name}</td>
              <td className="px-4 py-3 text-foreground/70">
                {UNIT_OF_MEASURE_LABELS[supply.unitOfMeasure]}
              </td>
              <td className="px-4 py-3 text-foreground/70">{Number(supply.currentStock)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    supply.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {supply.status === 'active' ? strings.statusActive : strings.statusInactive}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onAdjust(supply)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {strings.adjustButton}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Link from 'next/link';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS, ITEM_STATUS } from '../constants/inventory.constants';
import type { Supply } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.list;
const historyStrings = INVENTORY_STRINGS.history;

interface SupplyListProps {
  supplies: Supply[];
  onEdit: (supply: Supply) => void;
  onDelete: (supply: Supply) => void;
}

export function SupplyList({ supplies, onEdit, onDelete }: SupplyListProps) {
  if (supplies.length === 0) {
    return (
      <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>
    );
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
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  supply.status === ITEM_STATUS.ACTIVE
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {supply.status === ITEM_STATUS.ACTIVE ? strings.statusActive : strings.statusInactive}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(supply)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {strings.editButton}
                  </button>
                  <Link
                    href={`/inventory/${supply.id}/history`}
                    className="text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
                  >
                    {historyStrings.historyButton}
                  </Link>
                  <button
                    onClick={() => onDelete(supply)}
                    className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    {strings.deleteButton}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

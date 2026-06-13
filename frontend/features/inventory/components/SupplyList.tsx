import Link from 'next/link';
import { Pencil, History, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
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
                <Badge variant={supply.status === ITEM_STATUS.ACTIVE ? 'success' : 'neutral'}>
                  {supply.status === ITEM_STATUS.ACTIVE ? strings.statusActive : strings.statusInactive}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <IconButton label={strings.editButton} onClick={() => onEdit(supply)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <Link
                    href={`/inventory/${supply.id}/history`}
                    aria-label={historyStrings.historyButton}
                    title={historyStrings.historyButton}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <History className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <IconButton variant="danger" label={strings.deleteButton} onClick={() => onDelete(supply)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { SlidersHorizontal, Pencil, History, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Product } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.list;
const historyStrings = PRODUCTS_MESSAGES.history;

// La variante suele nombrarse "{producto} — {variante}"; el producto ya está arriba,
// así que mostramos solo el sufijo para evitar redundancia.
function variantLabel(productName: string, variantName: string): string {
  for (const sep of [' — ', ' - ', ' – ']) {
    const prefix = `${productName}${sep}`;
    if (variantName.startsWith(prefix)) return variantName.slice(prefix.length);
  }
  return variantName;
}

interface ProductListProps {
  products: Product[];
  onAdjust: (product: Product) => void;
  onHistory: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductList({ products, onAdjust, onHistory, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left text-foreground/70">
          <tr>
            <th className="px-4 py-3 font-medium">{strings.colProduct}</th>
            <th className="px-4 py-3 font-medium">{strings.colStock}</th>
            <th className="px-4 py-3 font-medium">{strings.colStatus}</th>
            <th className="px-4 py-3 font-medium">{strings.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-foreground/5 transition-colors">
              <td className="max-w-xs px-4 py-3 align-top">
                <p className="font-medium text-foreground break-words">{product.name}</p>
                {product.variants.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.variants.map((v) => {
                      const label = variantLabel(product.name, v.name);
                      return (
                        <span
                          key={v.id}
                          title={v.name}
                          className="inline-block max-w-[12rem] truncate rounded bg-foreground/8 px-1.5 py-0.5 text-xs text-foreground/50"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-foreground/70">{product.currentStock}</td>
              <td className="px-4 py-3">
                <Badge variant={product.status === 'active' ? 'success' : 'neutral'}>
                  {product.status === 'active' ? strings.statusActive : strings.statusInactive}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <IconButton label={strings.adjustButton} onClick={() => onAdjust(product)}>
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton label={strings.editButton} onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton label={historyStrings.viewHistory} onClick={() => onHistory(product)}>
                    <History className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                  <IconButton variant="danger" label={strings.deleteButton} onClick={() => onDelete(product)}>
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

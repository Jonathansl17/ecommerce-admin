import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Product, ProductVariant } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.list;
const historyStrings = PRODUCTS_MESSAGES.history;

interface FlatVariantRow extends ProductVariant {
  productName: string;
  productStatus: string;
}

interface ProductListProps {
  products: Product[];
  onAdjust: (variant: ProductVariant, productName: string) => void;
  onHistory: (variant: ProductVariant, productName: string) => void;
}

export function ProductList({ products, onAdjust, onHistory }: ProductListProps) {
  const rows: FlatVariantRow[] = products.flatMap((p) =>
    p.variants.map((v) => ({ ...v, productName: p.name, productStatus: p.status }))
  );

  if (rows.length === 0) {
    return <p className="text-sm text-foreground/60">{strings.emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left text-foreground/70">
          <tr>
            <th className="px-4 py-3 font-medium">{strings.colProduct}</th>
            <th className="px-4 py-3 font-medium">{strings.colVariant}</th>
            <th className="px-4 py-3 font-medium">{strings.colStock}</th>
            <th className="px-4 py-3 font-medium">{strings.colStatus}</th>
            <th className="px-4 py-3 font-medium">{strings.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/10">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-foreground/5 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{row.productName}</td>
              <td className="px-4 py-3 text-foreground/70">{row.name}</td>
              <td className="px-4 py-3 text-foreground/70">{row.currentStock}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.productStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {row.productStatus === 'active' ? strings.statusActive : strings.statusInactive}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => onAdjust(row, row.productName)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {strings.adjustButton}
                  </button>
                  <button
                    onClick={() => onHistory(row, row.productName)}
                    className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {historyStrings.viewHistory}
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

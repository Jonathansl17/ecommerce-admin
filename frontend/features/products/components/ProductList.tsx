import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Product } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.list;
const historyStrings = PRODUCTS_MESSAGES.history;

interface ProductListProps {
  products: Product[];
  onAdjust: (product: Product) => void;
  onHistory: (product: Product) => void;
}

export function ProductList({ products, onAdjust, onHistory }: ProductListProps) {
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
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{product.name}</p>
                {product.variants.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.variants.map((v) => (
                      <span
                        key={v.id}
                        className="inline-block rounded bg-foreground/8 px-1.5 py-0.5 text-xs text-foreground/50"
                      >
                        {v.name}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-foreground/70">{product.currentStock}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {product.status === 'active' ? strings.statusActive : strings.statusInactive}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => onAdjust(product)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {strings.adjustButton}
                  </button>
                  <button
                    onClick={() => onHistory(product)}
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

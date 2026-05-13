import type { Product } from '@/features/products/types/products.types';

export type AlertSeverity = 'low_stock' | 'out_of_stock';

export interface ProductAlertItem {
  product: Product;
  severity: AlertSeverity;
}

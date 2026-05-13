import type { Product } from '@/features/products/types/products.types';
import type { AlertSeverity, ProductAlertItem } from '../types/stock-alert.types';

export const getAlertSeverity = (product: Product): AlertSeverity | null => {
  if (product.minThreshold === null || product.minThreshold === undefined) return null;
  if (product.currentStock <= 0) return 'out_of_stock';
  if (product.currentStock <= product.minThreshold) return 'low_stock';
  return null;
};

export const buildProductAlerts = (products: Product[]): ProductAlertItem[] =>
  products.reduce<ProductAlertItem[]>((acc, product) => {
    const severity = getAlertSeverity(product);
    if (severity) acc.push({ product, severity });
    return acc;
  }, []);

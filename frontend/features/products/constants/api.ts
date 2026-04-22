export const PRODUCTS_API = {
  ADJUST_STOCK: (id: string) => `/products/${id}/adjust-stock`,
  MOVEMENTS: (id: string) => `/products/${id}/movements`,
  BULK_ADJUST_STOCK: '/products/bulk-adjust',
} as const;

export const PRODUCTS_API = {
  ADJUST_STOCK: (id: string) => `/products/${id}/adjust-stock`,
} as const;

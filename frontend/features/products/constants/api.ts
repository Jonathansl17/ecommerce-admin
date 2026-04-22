export const PRODUCTS_API = {
  ADJUST_STOCK: (id: string) => `/products/${id}/adjust-stock`,
  MOVEMENTS: (id: string) => `/products/${id}/movements`,
} as const;

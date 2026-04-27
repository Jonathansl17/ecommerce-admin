export const PRODUCTS_API = {
  GET_ALL: '/products',
  GET_ONE: (id: string) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
  ADJUST_STOCK: (variantId: string) => `/products/variants/${variantId}/adjust-stock`,
  MOVEMENTS: (variantId: string) => `/products/variants/${variantId}/movements`,
  BULK_ADJUST_STOCK: '/products/variants/bulk-adjust',
} as const;

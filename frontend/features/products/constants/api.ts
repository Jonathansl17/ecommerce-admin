export const PRODUCTS_API = {
  GET_ALL: '/products',
  GET_ONE: (id: string) => `/products/${id}`,
  CREATE: '/products',
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
  ADJUST_STOCK: (productId: string) => `/products/${productId}/adjust-stock`,
  MOVEMENTS: (productId: string) => `/products/${productId}/movements`,
  BULK_ADJUST_STOCK: '/products/bulk-adjust',
} as const;

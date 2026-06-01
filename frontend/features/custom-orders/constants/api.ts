export const CUSTOM_ORDERS_API = {
  GET_ALL: '/custom-orders',
  UPDATE_STATUS: (id: string) => `/custom-orders/${id}/status`,
} as const;

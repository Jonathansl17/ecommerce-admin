export const USERS_API = {
  GET_ALL: (search?: string) =>
    search ? `/store-users?search=${encodeURIComponent(search)}` : '/store-users',
  CHANGE_STATUS: (id: string) => `/store-users/${id}/status`,
} as const;

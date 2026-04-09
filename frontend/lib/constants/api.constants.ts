export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:4001/dashboard';

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
} as const;

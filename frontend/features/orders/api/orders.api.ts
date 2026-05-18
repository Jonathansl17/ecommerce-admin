import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { ORDERS_API } from '../constants/orders.constants';
import type {
  AdminOrder,
  AdminOrdersListResponse,
  OrderFilters,
  OrderStatus,
} from '../types/orders.types';

interface FetchOptions {
  signal?: AbortSignal;
}

export async function fetchOrders(
  filters: OrderFilters = {},
  { signal }: FetchOptions = {},
): Promise<AdminOrdersListResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.clientUserId) params.set('clientUserId', filters.clientUserId);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.limit != null) params.set('limit', String(filters.limit));
  if (filters.offset != null) params.set('offset', String(filters.offset));

  const query = params.toString();
  const path = query ? `${ORDERS_API.GET_ALL}?${query}` : ORDERS_API.GET_ALL;

  return apiFetch<AdminOrdersListResponse>(path, {
    signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function fetchOrder(
  id: string,
  { signal }: FetchOptions = {},
): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(ORDERS_API.GET_ONE(id), {
    signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  { signal }: FetchOptions = {},
): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(ORDERS_API.UPDATE_STATUS(id), {
    method: 'PATCH',
    body: { status } as Record<string, unknown>,
    signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function cancelOrder(
  id: string,
  { signal }: FetchOptions = {},
): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(ORDERS_API.CANCEL(id), {
    method: 'POST',
    signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

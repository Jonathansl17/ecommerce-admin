import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type { Supply, CreateSupplyForm } from '@/lib/types/inventory.types';

export async function getSupplies(token: string): Promise<Supply[]> {
  const res = await fetch(`${API_BASE_URL}/inventory/supplies`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error('fetch_error');

  const body: { data: Supply[]; error: null } = await res.json();
  return body.data;
}

export async function createSupply(
  data: CreateSupplyForm,
  token: string
): Promise<Supply> {
  const res = await fetch(`${API_BASE_URL}/inventory/supplies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw body;
  }

  const body: { data: Supply } = await res.json();
  return body.data;
}

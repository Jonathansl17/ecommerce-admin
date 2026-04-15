import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type { Supply, CreateSupplyForm, UpdateSupplyForm, CreateSupplyEntryForm, CreateConsumptionForm, SupplyHistory } from '@/lib/types/inventory.types';

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

export async function getSupplyMovements(
  supplyId: string,
  filters: { type?: string; dateFrom?: string; dateTo?: string },
  token: string
): Promise<SupplyHistory> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  const res = await fetch(
    `${API_BASE_URL}/inventory/supplies/${supplyId}/movements?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    }
  );

  if (!res.ok) throw new Error('fetch_error');

  const body: { data: SupplyHistory } = await res.json();
  return body.data;
}

export async function createSupplyEntry(
  data: CreateSupplyEntryForm,
  token: string
): Promise<Supply> {
  const res = await fetch(`${API_BASE_URL}/inventory/supplies/${data.supplyId}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: data.quantity, date: data.date }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw body;
  }

  const body: { data: Supply } = await res.json();
  return body.data;
}

export async function updateSupply(
  id: string,
  data: UpdateSupplyForm,
  token: string
): Promise<Supply> {
  const res = await fetch(`${API_BASE_URL}/inventory/supplies/${id}`, {
    method: 'PUT',
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

export async function registerConsumption(
  data: CreateConsumptionForm,
  token: string
): Promise<Supply[]> {
  const res = await fetch(`${API_BASE_URL}/inventory/consumption`, {
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

  const body: { data: Supply[] } = await res.json();
  return body.data;
}

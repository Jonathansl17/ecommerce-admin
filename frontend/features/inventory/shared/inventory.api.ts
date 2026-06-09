import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  Supply,
  CreateSupplyForm,
  UpdateSupplyForm,
  CreateSupplyEntriesForm,
  CreateConsumptionForm,
  SupplyHistory,
  PaginationMeta,
  InventoryReport,
} from '@/lib/types/inventory.types';

const unwrap = async <T>(promise: Promise<{ data: T }>): Promise<T> => {
  const body = await promise;
  return body.data;
};

const rethrowErrorBody = (err: unknown): never => {
  if (err instanceof ApiError) {
    throw err.body ?? {};
  }
  throw err;
};

export async function getSupplies(): Promise<Supply[]> {
  try {
    return await unwrap(
      apiFetch<{ data: Supply[] }>('/inventory/supplies', { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function createSupply(data: CreateSupplyForm): Promise<Supply> {
  try {
    return await unwrap(
      apiFetch<{ data: Supply }>('/inventory/supplies', {
        method: 'POST',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function getInventoryReport(
  dateFrom: string,
  dateTo: string,
): Promise<InventoryReport> {
  const params = new URLSearchParams({ dateFrom, dateTo });
  try {
    return await unwrap(
      apiFetch<{ data: InventoryReport }>(`/inventory/report?${params}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getSupplyMovements(
  supplyId: string,
  filters: { type?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number },
): Promise<{ data: SupplyHistory; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  try {
    const body = await apiFetch<{ data: SupplyHistory; meta: PaginationMeta }>(
      `/inventory/supplies/${supplyId}/movements?${params}`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );
    return { data: body.data, meta: body.meta };
  } catch {
    throw new Error('fetch_error');
  }
}

export async function updateSupply(id: string, data: UpdateSupplyForm): Promise<Supply> {
  try {
    return await unwrap(
      apiFetch<{ data: Supply }>(`/inventory/supplies/${id}`, {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function registerEntries(data: CreateSupplyEntriesForm): Promise<Supply[]> {
  try {
    return await unwrap(
      apiFetch<{ data: Supply[] }>('/inventory/entries', {
        method: 'POST',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function registerConsumption(data: CreateConsumptionForm): Promise<Supply[]> {
  try {
    return await unwrap(
      apiFetch<{ data: Supply[] }>('/inventory/consumption', {
        method: 'POST',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function deleteSupply(id: string): Promise<void> {
  try {
    await apiFetch<{ data: null }>(`/inventory/supplies/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

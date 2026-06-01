import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  Supply,
  CreateSupplyForm,
  UpdateSupplyForm,
  CreateSupplyEntriesForm,
  CreateConsumptionForm,
  SupplyHistory,
  InventoryReport,
} from '@/lib/types/inventory.types';

const TIMEOUT = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

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
      apiFetch<{ data: Supply[] }>('/inventory/supplies', { signal: TIMEOUT })
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
  filters: { type?: string; dateFrom?: string; dateTo?: string },
): Promise<SupplyHistory> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);

  try {
    return await unwrap(
      apiFetch<{ data: SupplyHistory }>(
        `/inventory/supplies/${supplyId}/movements?${params}`,
        { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
      )
    );
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

import { ApiError } from '@/lib/http/apiFetch';
import { ORDERS_STRINGS } from '../constants/orders.constants';

const { errors } = ORDERS_STRINGS;

export function toFetchListError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401 || err.status === 403) return errors.fetchList;
    if (err.status >= 500) return errors.fetchList;
  }
  return errors.fetchList;
}

export function toFetchDetailError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 404) return errors.fetchDetail;
  }
  return errors.fetchDetail;
}

export function toUpdateStatusError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status >= 400 && err.status < 500) return errors.updateStatus;
  }
  return errors.updateStatus;
}

export function toCancelError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status >= 400 && err.status < 500) return errors.cancel;
  }
  return errors.cancel;
}

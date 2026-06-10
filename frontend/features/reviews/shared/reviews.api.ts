import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  Review,
  ReviewListResponse,
  ReviewStats,
  RejectReviewPayload,
  DeleteReviewPayload,
  GetReviewsParams,
  GetReviewStatsParams,
} from '../types/reviews.types';

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

export async function getReviews({
  status,
  product,
  client,
  page = 1,
  pageSize,
}: GetReviewsParams = {}): Promise<ReviewListResponse> {
  const search = new URLSearchParams();
  if (status) search.set('status', status);
  if (product?.trim()) search.set('product', product.trim());
  if (client?.trim()) search.set('client', client.trim());
  if (pageSize) {
    search.set('limit', String(pageSize));
    search.set('offset', String((page - 1) * pageSize));
  }
  const query = search.toString();

  try {
    return await unwrap(
      apiFetch<{ data: ReviewListResponse }>(`/reviews${query ? `?${query}` : ''}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getReviewStats({
  product,
  client,
}: GetReviewStatsParams = {}): Promise<ReviewStats> {
  const search = new URLSearchParams();
  if (product?.trim()) search.set('product', product.trim());
  if (client?.trim()) search.set('client', client.trim());
  const query = search.toString();

  try {
    return await unwrap(
      apiFetch<{ data: ReviewStats }>(`/reviews/stats${query ? `?${query}` : ''}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function getReview(id: string): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}`, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch {
    throw new Error('fetch_error');
  }
}

export async function approveReview(id: string): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/approve`, {
        method: 'PATCH',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function rejectReview(id: string, data: RejectReviewPayload): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/reject`, {
        method: 'PATCH',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function respondToReview(id: string, responseText: string): Promise<Review> {
  try {
    return await unwrap(
      apiFetch<{ data: Review }>(`/reviews/${id}/respond`, {
        method: 'POST',
        body: { responseText },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
  } catch (err) {
    return rethrowErrorBody(err);
  }
}

export async function deleteReview(id: string, data: DeleteReviewPayload): Promise<void> {
  try {
    await apiFetch<{ data: unknown }>(`/reviews/${id}/moderation`, {
      method: 'DELETE',
      body: data as unknown as Record<string, unknown>,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    rethrowErrorBody(err);
  }
}

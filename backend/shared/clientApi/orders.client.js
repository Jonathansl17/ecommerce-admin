import { HTTP_METHODS } from './client-api.constants.js';
import { clientApiFetch } from './client-api.fetch.js';

const ORDERS_PATH = '/orders';

const orderPath = (id) => `${ORDERS_PATH}/${encodeURIComponent(id)}`;

export const listOrders = ({ status, clientUserId, from, to, limit, offset, signal } = {}) =>
  clientApiFetch(ORDERS_PATH, {
    method: HTTP_METHODS.GET,
    query: { status, clientUserId, from, to, limit, offset },
    signal,
  });

export const getOrder = (id, { signal } = {}) =>
  clientApiFetch(orderPath(id), { method: HTTP_METHODS.GET, signal });

export const updateOrderStatus = (id, { status }, { signal } = {}) =>
  clientApiFetch(`${orderPath(id)}/status`, {
    method: HTTP_METHODS.PATCH,
    body: { status },
    signal,
  });

export const cancelOrder = (id, { signal } = {}) =>
  clientApiFetch(`${orderPath(id)}/cancel`, { method: HTTP_METHODS.POST, signal });

export const approvePayment = (id, paymentId, { signal } = {}) =>
  clientApiFetch(`${orderPath(id)}/payments/${encodeURIComponent(paymentId)}/approve`, {
    method: HTTP_METHODS.PATCH,
    signal,
  });

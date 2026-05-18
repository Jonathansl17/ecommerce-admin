import { HTTP_METHODS } from './client-api.constants.js';
import { clientApiFetch } from './client-api.fetch.js';

const STOCK_DECREMENT_PATH = '/stock/decrement';

export const decrementStock = (items, { signal } = {}) =>
  clientApiFetch(STOCK_DECREMENT_PATH, {
    method: HTTP_METHODS.POST,
    body: { items },
    signal,
  });

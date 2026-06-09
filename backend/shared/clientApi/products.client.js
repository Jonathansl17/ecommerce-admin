import { HTTP_METHODS } from './client-api.constants.js';
import { clientApiFetch } from './client-api.fetch.js';

const PRODUCTS_PATH = '/products';

const productPath = (itemId) => `${PRODUCTS_PATH}/${encodeURIComponent(itemId)}`;

export const createProduct = (payload, { signal } = {}) =>
  clientApiFetch(PRODUCTS_PATH, {
    method: HTTP_METHODS.POST,
    body: payload,
    signal,
  });

export const updateProduct = (itemId, payload, { signal } = {}) =>
  clientApiFetch(productPath(itemId), {
    method: HTTP_METHODS.PATCH,
    body: payload,
    signal,
  });

export const deleteProduct = (itemId, { signal } = {}) =>
  clientApiFetch(productPath(itemId), {
    method: HTTP_METHODS.DELETE,
    signal,
  });

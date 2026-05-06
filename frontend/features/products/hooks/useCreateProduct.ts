import { useCallback } from 'react';
import type { Dispatch } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { CreateProductDTO, Product } from '../types/products.types';
import type { ProductsAction } from '../reducers/productsReducer';

export function useCreateProduct(dispatch: Dispatch<ProductsAction>) {
  const create = useCallback(
    async (data: CreateProductDTO): Promise<Product | null> => {
      dispatch({ type: 'CREATE_START' });
      try {
        const product = await apiFetch<Product>(PRODUCTS_API.CREATE, {
          method: 'POST',
          body: data as unknown as Record<string, unknown>,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        dispatch({ type: 'CREATE_SUCCESS', payload: product });
        return product;
      } catch {
        dispatch({ type: 'CREATE_ERROR', payload: PRODUCTS_MESSAGES.errors.createError });
        return null;
      }
    },
    [dispatch]
  );

  return { create };
}

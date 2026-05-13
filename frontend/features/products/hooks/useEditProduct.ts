import { useCallback } from 'react';
import type { Dispatch } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { EditProductDTO, Product } from '../types/products.types';
import type { ProductsAction } from '../reducers/productsReducer';

export function useEditProduct(dispatch: Dispatch<ProductsAction>) {
  const edit = useCallback(
    async (id: string, data: EditProductDTO): Promise<Product | null> => {
      dispatch({ type: 'UPDATE_START' });
      try {
        const product = await apiFetch<Product>(PRODUCTS_API.UPDATE(id), {
          method: 'PUT',
          body: data as unknown as Record<string, unknown>,
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        dispatch({ type: 'UPDATE_SUCCESS', payload: product });
        return product;
      } catch {
        dispatch({ type: 'UPDATE_ERROR', payload: PRODUCTS_MESSAGES.errors.updateError });
        return null;
      }
    },
    [dispatch]
  );

  return { edit };
}

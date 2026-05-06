import { useCallback } from 'react';
import type { Dispatch } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '../constants/api';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { ProductsAction } from '../reducers/productsReducer';

export function useDeleteProduct(dispatch: Dispatch<ProductsAction>) {
  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      dispatch({ type: 'DELETE_START' });
      try {
        await apiFetch(PRODUCTS_API.DELETE(id), {
          method: 'DELETE',
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        dispatch({ type: 'DELETE_SUCCESS', payload: id });
        return true;
      } catch {
        dispatch({ type: 'DELETE_ERROR', payload: PRODUCTS_MESSAGES.errors.deleteError });
        return false;
      }
    },
    [dispatch]
  );

  return { remove };
}

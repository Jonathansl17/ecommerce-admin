import type { Product } from '../types/products.types';

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  isUpdating: boolean;
  updateError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
}

export type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_START' }
  | { type: 'CREATE_SUCCESS'; payload: Product }
  | { type: 'CREATE_ERROR'; payload: string }
  | { type: 'CREATE_CLEAR_ERROR' }
  | { type: 'UPDATE_START' }
  | { type: 'UPDATE_SUCCESS'; payload: Product }
  | { type: 'UPDATE_ERROR'; payload: string }
  | { type: 'UPDATE_CLEAR_ERROR' }
  | { type: 'DELETE_START' }
  | { type: 'DELETE_SUCCESS'; payload: string }
  | { type: 'DELETE_ERROR'; payload: string }
  | { type: 'DELETE_CLEAR_ERROR' };

export const initialProductsState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
  isUpdating: false,
  updateError: null,
  isDeleting: false,
  deleteError: null,
};

export function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, products: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'CREATE_START':
      return { ...state, isCreating: true, createError: null };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        isCreating: false,
        products: [...state.products, action.payload].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      };
    case 'CREATE_ERROR':
      return { ...state, isCreating: false, createError: action.payload };
    case 'CREATE_CLEAR_ERROR':
      return { ...state, createError: null };

    case 'UPDATE_START':
      return { ...state, isUpdating: true, updateError: null };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        isUpdating: false,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'UPDATE_ERROR':
      return { ...state, isUpdating: false, updateError: action.payload };
    case 'UPDATE_CLEAR_ERROR':
      return { ...state, updateError: null };

    case 'DELETE_START':
      return { ...state, isDeleting: true, deleteError: null };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        isDeleting: false,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case 'DELETE_ERROR':
      return { ...state, isDeleting: false, deleteError: action.payload };
    case 'DELETE_CLEAR_ERROR':
      return { ...state, deleteError: null };

    default:
      return state;
  }
}

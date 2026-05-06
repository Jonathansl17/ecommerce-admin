import type { Product } from '../types/products.types';

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
}

export type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_START' }
  | { type: 'CREATE_SUCCESS'; payload: Product }
  | { type: 'CREATE_ERROR'; payload: string }
  | { type: 'CREATE_CLEAR_ERROR' }
  | { type: 'UPDATE_SUCCESS'; payload: Product }
  | { type: 'DELETE_SUCCESS'; payload: string };

export const initialProductsState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
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
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

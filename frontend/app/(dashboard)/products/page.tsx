'use client';

import { useReducer, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '@/features/products/constants/api';
import { PRODUCTS_MESSAGES } from '@/features/products/constants/messages';
import { useAdjustSupplyStock } from '@/features/products/hooks/useAdjustSupplyStock';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';
import { productsReducer, initialProductsState } from '@/features/products/reducers/productsReducer';
import { ProductList } from '@/features/products/components/ProductList';
import { StockAdjustmentModal } from '@/features/products/components/StockAdjustmentModal';
import { StockMovementHistoryModal } from '@/features/products/components/StockMovementHistoryModal';
import { BulkStockAdjustmentTable } from '@/features/products/components/BulkStockAdjustmentTable';
import { CreateProductModal } from '@/features/products/components/CreateProductModal';
import type { Product, AdjustStockForm, CreateProductFormData } from '@/features/products/types/products.types';

const strings = PRODUCTS_MESSAGES;

export default function ProductsPage() {
  const [state, dispatch] = useReducer(productsReducer, initialProductsState);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { adjustStock, error: adjustError } = useAdjustSupplyStock((updated) => {
    dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
    setAdjustingProduct(null);
    setHistoryRefreshKey((k) => k + 1);
  });

  const { create } = useCreateProduct(dispatch);

  const loadProducts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await apiFetch<Product[]>(PRODUCTS_API.GET_ALL, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: strings.errors.fetchError });
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSave = async (id: string, data: AdjustStockForm) => {
    await adjustStock(id, data);
  };

  const handleBulkDone = () => {
    setIsBulkMode(false);
    loadProducts();
  };

  const handleCreate = async (data: CreateProductFormData) => {
    const dto = {
      name: data.name,
      price: data.price,
      status: data.status,
      ...(data.description ? { description: data.description } : {}),
    };
    const product = await create(dto);
    if (product) {
      setIsCreateOpen(false);
    }
  };

  const handleOpenCreate = () => {
    dispatch({ type: 'CREATE_CLEAR_ERROR' });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    dispatch({ type: 'CREATE_CLEAR_ERROR' });
    setIsCreateOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isBulkMode ? strings.bulk.title : strings.page.title}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {isBulkMode ? strings.bulk.subtitle : strings.page.subtitle}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {isBulkMode ? (
              <button
                onClick={() => setIsBulkMode(false)}
                className="px-4 py-2 text-sm rounded-md border border-foreground/20 text-foreground hover:bg-foreground/5 transition-colors"
              >
                {strings.bulk.backToList}
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  {strings.create.addButton}
                </button>
                <button
                  onClick={() => setIsBulkMode(true)}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {strings.bulk.title}
                </button>
              </>
            )}
          </div>
        </div>

        {state.error ? (
          <p role="alert" className="text-sm text-red-500">
            {state.error}
          </p>
        ) : isBulkMode ? (
          <BulkStockAdjustmentTable products={state.products} onDone={handleBulkDone} />
        ) : (
          <ProductList
            products={state.products}
            onAdjust={(product) => {
              setModalKey((k) => k + 1);
              setAdjustingProduct(product);
            }}
            onHistory={(product) => setHistoryProduct(product)}
          />
        )}
      </div>

      {isCreateOpen && (
        <CreateProductModal
          onClose={handleCloseCreate}
          onSave={handleCreate}
          serverError={state.createError}
        />
      )}

      <StockAdjustmentModal
        key={modalKey}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
        onSave={handleSave}
        serverError={adjustError}
      />

      <StockMovementHistoryModal
        product={historyProduct}
        refreshKey={historyRefreshKey}
        onClose={() => setHistoryProduct(null)}
      />
    </>
  );
}

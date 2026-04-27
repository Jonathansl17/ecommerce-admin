'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import { PRODUCTS_API } from '@/features/products/constants/api';
import { PRODUCTS_MESSAGES } from '@/features/products/constants/messages';
import { useAdjustSupplyStock } from '@/features/products/hooks/useAdjustSupplyStock';
import { ProductList } from '@/features/products/components/ProductList';
import { StockAdjustmentModal } from '@/features/products/components/StockAdjustmentModal';
import { StockMovementHistoryModal } from '@/features/products/components/StockMovementHistoryModal';
import { BulkStockAdjustmentTable } from '@/features/products/components/BulkStockAdjustmentTable';
import type { Product, ProductVariant, AdjustStockForm } from '@/features/products/types/products.types';

const strings = PRODUCTS_MESSAGES;

interface ActiveVariant {
  variant: ProductVariant;
  productName: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [adjustingVariant, setAdjustingVariant] = useState<ActiveVariant | null>(null);
  const [historyVariant, setHistoryVariant] = useState<ActiveVariant | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const { adjustStock, error: adjustError } = useAdjustSupplyStock((updated) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variants: p.variants.map((v) => (v.id === updated.id ? updated : v)),
      }))
    );
    setAdjustingVariant(null);
    setHistoryRefreshKey((k) => k + 1);
  });

  const loadProducts = useCallback(async () => {
    try {
      const data = await apiFetch<Product[]>(PRODUCTS_API.GET_ALL, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      setProducts(data);
      setFetchError(null);
    } catch {
      setFetchError(strings.errors.fetchError);
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
              <button
                onClick={() => setIsBulkMode(true)}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {strings.bulk.title}
              </button>
            )}
          </div>
        </div>

        {fetchError ? (
          <p role="alert" className="text-sm text-red-500">
            {fetchError}
          </p>
        ) : isBulkMode ? (
          <BulkStockAdjustmentTable products={products} onDone={handleBulkDone} />
        ) : (
          <ProductList
            products={products}
            onAdjust={(variant, productName) => {
              setModalKey((k) => k + 1);
              setAdjustingVariant({ variant, productName });
            }}
            onHistory={(variant, productName) => setHistoryVariant({ variant, productName })}
          />
        )}
      </div>

      <StockAdjustmentModal
        key={modalKey}
        variant={adjustingVariant?.variant ?? null}
        productName={adjustingVariant?.productName}
        onClose={() => setAdjustingVariant(null)}
        onSave={handleSave}
        serverError={adjustError}
      />

      <StockMovementHistoryModal
        variant={historyVariant?.variant ?? null}
        productName={historyVariant?.productName}
        refreshKey={historyRefreshKey}
        onClose={() => setHistoryVariant(null)}
      />
    </>
  );
}

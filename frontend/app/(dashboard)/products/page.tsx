'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { getSupplies } from '@/features/inventory/shared/inventory.api';
import { useAdjustSupplyStock } from '@/features/products/hooks/useAdjustSupplyStock';
import { ProductList } from '@/features/products/components/ProductList';
import { StockAdjustmentModal } from '@/features/products/components/StockAdjustmentModal';
import { StockMovementHistoryModal } from '@/features/products/components/StockMovementHistoryModal';
import { BulkStockAdjustmentTable } from '@/features/products/components/BulkStockAdjustmentTable';
import { PRODUCTS_MESSAGES } from '@/features/products/constants/messages';
import type { Supply } from '@/lib/types/inventory.types';
import type { AdjustStockForm } from '@/features/products/types/products.types';

const strings = PRODUCTS_MESSAGES;

export default function ProductsPage() {
  const { token } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [adjustingSupply, setAdjustingSupply] = useState<Supply | null>(null);
  const [historySupply, setHistorySupply] = useState<Supply | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const { adjustStock, error: adjustError } = useAdjustSupplyStock((updated) => {
    setSupplies((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setAdjustingSupply(null);
    setHistoryRefreshKey((k) => k + 1);
  });

  const loadSupplies = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getSupplies(token);
      setSupplies(data);
      setFetchError(null);
    } catch {
      setFetchError(strings.errors.fetchError);
    }
  }, [token]);

  useEffect(() => {
    loadSupplies();
  }, [loadSupplies]);

  const handleSave = async (id: string, data: AdjustStockForm) => {
    await adjustStock(id, data);
  };

  const handleBulkDone = () => {
    setIsBulkMode(false);
    loadSupplies();
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
          <p role="alert" className="text-sm text-red-500">{fetchError}</p>
        ) : isBulkMode ? (
          <BulkStockAdjustmentTable supplies={supplies} onDone={handleBulkDone} />
        ) : (
          <ProductList
            supplies={supplies}
            onAdjust={(supply) => { setModalKey((k) => k + 1); setAdjustingSupply(supply); }}
            onHistory={(supply) => setHistorySupply(supply)}
          />
        )}
      </div>

      <StockAdjustmentModal
        key={modalKey}
        supply={adjustingSupply}
        onClose={() => setAdjustingSupply(null)}
        onSave={handleSave}
        serverError={adjustError}
      />

      <StockMovementHistoryModal
        supply={historySupply}
        refreshKey={historyRefreshKey}
        onClose={() => setHistorySupply(null)}
      />
    </>
  );
}

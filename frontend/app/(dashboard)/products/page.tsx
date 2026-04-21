'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { getSupplies } from '@/features/inventory/inventory.api';
import { useAdjustSupplyStock } from '@/features/products/hooks/useAdjustSupplyStock';
import { ProductList } from '@/features/products/components/ProductList';
import { StockAdjustmentModal } from '@/features/products/components/StockAdjustmentModal';
import { PRODUCTS_MESSAGES } from '@/features/products/constants/messages';
import type { Supply } from '@/lib/types/inventory.types';
import type { AdjustStockForm } from '@/features/products/types/products.types';

const strings = PRODUCTS_MESSAGES;

export default function ProductsPage() {
  const { token } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [adjustingSupply, setAdjustingSupply] = useState<Supply | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const { adjustStock, error: adjustError } = useAdjustSupplyStock((updated) => {
    setSupplies((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setAdjustingSupply(null);
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

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
          <p className="mt-1 text-sm text-foreground/60">{strings.page.subtitle}</p>
        </div>

        {fetchError ? (
          <p role="alert" className="text-sm text-red-500">{fetchError}</p>
        ) : (
          <ProductList
            supplies={supplies}
            onAdjust={(supply) => { setModalKey((k) => k + 1); setAdjustingSupply(supply); }}
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
    </>
  );
}

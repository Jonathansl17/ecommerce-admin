'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { SupplyForm } from '@/features/inventory/SupplyForm';
import { SupplyList } from '@/features/inventory/SupplyList';
import { getSupplies, createSupply } from '@/features/inventory/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/inventory.constants';
import type { Supply, CreateSupplyForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS;

export default function InventoryPage() {
  const { token } = useAuth();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

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

  const handleCreate = async (data: CreateSupplyForm) => {
    if (!token) return;
    try {
      setServerError(null);
      const newSupply = await createSupply(data, token);
      setSupplies((prev) => [...prev, newSupply]);
    } catch (err: unknown) {
      const error = err as { error?: string };
      if (error?.error === strings.errors.duplicateName) {
        setServerError(strings.errors.duplicateName);
      } else {
        setServerError(strings.errors.createError);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{strings.page.title}</h1>
        <p className="mt-1 text-sm text-foreground/60">{strings.page.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <SupplyForm onSubmit={handleCreate} serverError={serverError} />

        <div className="space-y-3">
          {fetchError ? (
            <p role="alert" className="text-sm text-red-500">{fetchError}</p>
          ) : (
            <SupplyList supplies={supplies} />
          )}
        </div>
      </div>
    </div>
  );
}

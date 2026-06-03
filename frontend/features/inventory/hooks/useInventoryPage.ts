'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSupplies,
  createSupply,
  updateSupply,
} from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS, INVENTORY_CONFIG } from '@/features/inventory/constants/inventory.constants';
import { useDeleteSupply } from './useDeleteSupply';
import { useEntryModal } from './useEntryModal';
import { useConsumptionModal } from './useConsumptionModal';
import type {
  Supply,
  CreateSupplyForm,
  UpdateSupplyForm,
} from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS;

export function useInventoryPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [supplyFormOpen, setSupplyFormOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [supplyFormError, setSupplyFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [showCreationHint, setShowCreationHint] = useState(false);
  const [createdSupply, setCreatedSupply] = useState<Supply | null>(null);

  const loadSupplies = useCallback(async () => {
    try {
      const data = await getSupplies();
      setSupplies(data);
      setFetchError(null);
    } catch {
      setFetchError(strings.errors.fetchError);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (cancelled) return;
      await loadSupplies();
      if (cancelled) return;
      timeout = setTimeout(poll, INVENTORY_CONFIG.POLL_INTERVAL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [loadSupplies]);

  const deleteModal = useDeleteSupply((id) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id));
  });

  const entryModal = useEntryModal((updatedSupplies) => {
    setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
  });

  const consumptionModal = useConsumptionModal((updatedSupplies) => {
    setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
  });

  // --- Supply form ---
  const openSupplyForm = () => { setSupplyFormError(null); setSupplyFormOpen(true); };
  const closeSupplyForm = () => { setSupplyFormOpen(false); setSupplyFormError(null); };

  // --- Edit ---
  const openEdit = (supply: Supply) => { setEditError(null); setEditingSupply(supply); };
  const closeEdit = () => { setEditingSupply(null); setEditError(null); };

  // --- Creation hint ---
  const dismissCreationHint = () => { setShowCreationHint(false); setCreatedSupply(null); };
  const editFromHint = () => { setEditingSupply(createdSupply); dismissCreationHint(); };

  // --- CRUD ---
  const handleCreate = async (data: CreateSupplyForm) => {
    try {
      setSupplyFormError(null);
      const newSupply = await createSupply(data);
      setSupplies((prev) => [...prev, newSupply]);
      setSupplyFormOpen(false);
      setCreatedSupply(newSupply);
      setShowCreationHint(true);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setSupplyFormError(
        error?.error === strings.errors.duplicateName
          ? strings.errors.duplicateName
          : strings.errors.createError
      );
    }
  };

  const handleUpdate = async (id: string, data: UpdateSupplyForm) => {
    try {
      setEditError(null);
      const updated = await updateSupply(id, data);
      setSupplies((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditingSupply(null);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setEditError(
        error?.error === strings.errors.duplicateName
          ? strings.errors.duplicateName
          : strings.errors.updateError
      );
    }
  };

  return {
    // data
    supplies,
    fetchError,
    // supply form
    supplyFormOpen,
    supplyFormError,
    openSupplyForm,
    closeSupplyForm,
    handleCreate,
    // edit
    editingSupply,
    editError,
    openEdit,
    closeEdit,
    handleUpdate,
    // creation hint
    showCreationHint,
    editFromHint,
    dismissCreationHint,
    // delete modal
    ...deleteModal,
    // entry modal
    ...entryModal,
    handleQuickEntry: entryModal.openEntry,
    // consumption modal
    ...consumptionModal,
  };
}

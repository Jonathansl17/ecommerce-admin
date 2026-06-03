'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSupplies,
  createSupply,
  updateSupply,
  registerEntries,
  registerConsumption,
} from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS, INVENTORY_CONFIG } from '@/features/inventory/constants/inventory.constants';
import type {
  Supply,
  CreateSupplyForm,
  UpdateSupplyForm,
  CreateSupplyEntriesForm,
  CreateConsumptionForm,
} from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS;

export function useInventoryPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [supplyFormOpen, setSupplyFormOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [quickEntrySupplyId, setQuickEntrySupplyId] = useState<string | undefined>(undefined);

  const [supplyFormError, setSupplyFormError] = useState<string | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [consumptionError, setConsumptionError] = useState<string | null>(null);
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
    loadSupplies();
    const interval = setInterval(loadSupplies, INVENTORY_CONFIG.POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadSupplies]);

  // --- Open handlers ---
  const openSupplyForm = () => { setSupplyFormError(null); setSupplyFormOpen(true); };
  const openEntry = (supplyId?: string) => { setEntryError(null); setQuickEntrySupplyId(supplyId); setEntryOpen(true); };
  const openConsumption = () => { setConsumptionError(null); setConsumptionOpen(true); };

  // --- Close handlers ---
  const closeSupplyForm = () => { setSupplyFormOpen(false); setSupplyFormError(null); };
  const closeEntry = () => { setEntryOpen(false); setEntryError(null); setQuickEntrySupplyId(undefined); };
  const closeConsumption = () => { setConsumptionOpen(false); setConsumptionError(null); };
  const closeEdit = () => { setEditingSupply(null); setEditError(null); };

  // --- Creation hint actions ---
  const dismissCreationHint = () => { setShowCreationHint(false); setCreatedSupply(null); };
  const editFromHint = () => { setEditingSupply(createdSupply); dismissCreationHint(); };

  // --- CRUD handlers ---
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

  const handleCreateEntry = async (data: CreateSupplyEntriesForm) => {
    try {
      setEntryError(null);
      const updatedSupplies = await registerEntries(data);
      setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
      setEntryOpen(false);
      setQuickEntrySupplyId(undefined);
    } catch {
      setEntryError(strings.errors.entryError);
    }
  };

  const handleConsumption = async (data: CreateConsumptionForm) => {
    try {
      setConsumptionError(null);
      const updatedSupplies = await registerConsumption(data);
      setSupplies((prev) => prev.map((s) => updatedSupplies.find((u) => u.id === s.id) ?? s));
      setConsumptionOpen(false);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setConsumptionError(
        error?.error === strings.errors.stockInsufficient
          ? strings.errors.stockInsufficient
          : strings.errors.consumptionError
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

  const openEdit = (supply: Supply) => { setEditError(null); setEditingSupply(supply); };
  const handleQuickEntry = (supplyId: string) => openEntry(supplyId);

  return {
    // data
    supplies,
    fetchError,
    // modal open state
    supplyFormOpen,
    entryOpen,
    consumptionOpen,
    editingSupply,
    quickEntrySupplyId,
    // server errors
    supplyFormError,
    entryError,
    consumptionError,
    editError,
    // creation hint
    showCreationHint,
    // open/close actions
    openSupplyForm,
    openEntry,
    openEdit,
    openConsumption,
    closeSupplyForm,
    closeEntry,
    closeConsumption,
    closeEdit,
    // hint actions
    editFromHint,
    dismissCreationHint,
    // CRUD
    handleCreate,
    handleCreateEntry,
    handleConsumption,
    handleUpdate,
    handleQuickEntry,
  };
}

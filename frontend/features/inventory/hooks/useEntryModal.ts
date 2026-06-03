'use client';

import { useState } from 'react';
import { registerEntries } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { Supply, CreateSupplyEntriesForm } from '@/lib/types/inventory.types';

export function useEntryModal(onEntriesCreated: (updatedSupplies: Supply[]) => void) {
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [quickEntrySupplyId, setQuickEntrySupplyId] = useState<string | undefined>(undefined);

  const openEntry = (supplyId?: string) => {
    setEntryError(null);
    setQuickEntrySupplyId(supplyId);
    setEntryOpen(true);
  };

  const closeEntry = () => {
    setEntryOpen(false);
    setEntryError(null);
    setQuickEntrySupplyId(undefined);
  };

  const handleCreateEntry = async (data: CreateSupplyEntriesForm) => {
    try {
      setEntryError(null);
      const updatedSupplies = await registerEntries(data);
      onEntriesCreated(updatedSupplies);
      setEntryOpen(false);
      setQuickEntrySupplyId(undefined);
    } catch {
      setEntryError(INVENTORY_STRINGS.errors.entryError);
    }
  };

  return { entryOpen, entryError, quickEntrySupplyId, openEntry, closeEntry, handleCreateEntry };
}

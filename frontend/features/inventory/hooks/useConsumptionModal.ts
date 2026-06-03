'use client';

import { useState } from 'react';
import { registerConsumption } from '@/features/inventory/shared/inventory.api';
import { INVENTORY_STRINGS } from '@/features/inventory/constants/inventory.constants';
import type { Supply, CreateConsumptionForm } from '@/lib/types/inventory.types';

export function useConsumptionModal(onConsumptionCreated: (updatedSupplies: Supply[]) => void) {
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [consumptionError, setConsumptionError] = useState<string | null>(null);

  const openConsumption = () => { setConsumptionError(null); setConsumptionOpen(true); };
  const closeConsumption = () => { setConsumptionOpen(false); setConsumptionError(null); };

  const handleConsumption = async (data: CreateConsumptionForm) => {
    try {
      setConsumptionError(null);
      const updatedSupplies = await registerConsumption(data);
      onConsumptionCreated(updatedSupplies);
      setConsumptionOpen(false);
    } catch (err: unknown) {
      const error = err as { error?: string };
      setConsumptionError(
        error?.error === INVENTORY_STRINGS.errors.stockInsufficient
          ? INVENTORY_STRINGS.errors.stockInsufficient
          : INVENTORY_STRINGS.errors.consumptionError
      );
    }
  };

  return { consumptionOpen, consumptionError, openConsumption, closeConsumption, handleConsumption };
}

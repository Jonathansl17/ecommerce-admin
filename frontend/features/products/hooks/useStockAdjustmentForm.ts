'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustStockSchema } from '../shared/validators';
import type { AdjustStockForm } from '../types/products.types';
import type { Supply } from '@/lib/types/inventory.types';

export function useStockAdjustmentForm(
  supply: Supply | null,
  onSave: (id: string, data: AdjustStockForm) => Promise<void>
) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdjustStockForm>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: { reason: 'manual_adjustment' },
  });

  const onFormSubmit = async (data: AdjustStockForm) => {
    if (!supply) return;
    await onSave(supply.id, data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
  };
}

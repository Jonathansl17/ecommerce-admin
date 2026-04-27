'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustStockSchema } from '../shared/validators';
import type { AdjustStockForm, ProductVariant } from '../types/products.types';

export function useStockAdjustmentForm(
  variant: ProductVariant | null,
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
    if (!variant) return;
    await onSave(variant.id, data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
  };
}

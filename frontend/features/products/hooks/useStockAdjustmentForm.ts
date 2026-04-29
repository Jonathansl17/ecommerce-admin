'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adjustStockSchema } from '../shared/validators';
import type { AdjustStockForm, Product } from '../types/products.types';

export function useStockAdjustmentForm(
  product: Product | null,
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
    if (!product) return;
    await onSave(product.id, data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
  };
}

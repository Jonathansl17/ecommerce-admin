'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INVENTORY_STRINGS } from '../inventory.constants';
import type { CreateConsumptionForm, Supply } from '@/lib/types/inventory.types';

const { validation: v } = INVENTORY_STRINGS;

const schema = z.object({
  items: z
    .array(
      z.object({
        supplyId: z.string().min(1, v.supplyRequired),
        quantity: z
          .number({ invalid_type_error: v.consumptionQuantityMin })
          .min(0.01, v.consumptionQuantityMin),
      })
    )
    .min(1, v.itemsRequired),
  reference: z.string().max(200).optional().or(z.literal('')),
  date: z.string().min(1, v.dateRequired),
});

const today = () => new Date().toISOString().split('T')[0];

export function useConsumptionForm(
  supplies: Supply[],
  onSubmit: (data: CreateConsumptionForm) => Promise<void>
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateConsumptionForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [{ supplyId: '', quantity: undefined as unknown as number }],
      reference: '',
      date: today(),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  const availableSupplies = (index: number) => {
    const selectedIds = watchedItems
      .map((item, i) => (i !== index ? item.supplyId : null))
      .filter(Boolean);
    return supplies.filter((s) => !selectedIds.includes(s.id));
  };

  const onFormSubmit = async (data: CreateConsumptionForm) => {
    await onSubmit(data);
    reset({
      items: [{ supplyId: '', quantity: undefined as unknown as number }],
      reference: '',
      date: today(),
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    fields,
    append,
    remove,
    availableSupplies,
    errors,
    isSubmitting,
  };
}

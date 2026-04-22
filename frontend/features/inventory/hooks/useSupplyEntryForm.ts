'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INVENTORY_STRINGS } from '../constants/inventory.constants';
import type { CreateSupplyEntriesForm, Supply } from '@/lib/types/inventory.types';

const { validation: v } = INVENTORY_STRINGS;

const schema = z.object({
  items: z
    .array(
      z.object({
        supplyId: z.string().min(1, v.supplyRequired),
        quantity: z
          .number({ invalid_type_error: v.entryQuantityMin })
          .min(0.01, v.entryQuantityMin),
      })
    )
    .min(1, v.itemsRequired),
  date: z.string().min(1, v.dateRequired),
});

const today = () => new Date().toISOString().split('T')[0];

export function useSupplyEntryForm(
  supplies: Supply[],
  onSubmit: (data: CreateSupplyEntriesForm) => Promise<void>,
  defaultSupplyId?: string
) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplyEntriesForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [{ supplyId: defaultSupplyId ?? '', quantity: NaN }],
      date: today(),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  useEffect(() => {
    if (defaultSupplyId) {
      reset({
        items: [{ supplyId: defaultSupplyId, quantity: NaN }],
        date: today(),
      });
    }
  }, [defaultSupplyId, reset]);

  const availableSupplies = (index: number) => {
    const selectedIds = watchedItems
      .map((item, i) => (i !== index ? item.supplyId : null))
      .filter(Boolean);
    return supplies.filter((s) => !selectedIds.includes(s.id));
  };

  const onFormSubmit = async (data: CreateSupplyEntriesForm) => {
    await onSubmit(data);
    reset({ items: [{ supplyId: '', quantity: NaN }], date: today() });
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
    suppliesCount: supplies.length,
  };
}

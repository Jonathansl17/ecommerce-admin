'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_VALUES } from '../constants/inventory.constants';
import type { CreateSupplyForm } from '@/lib/types/inventory.types';

const { validation: v } = INVENTORY_STRINGS;

const schema = z.object({
  name: z.string().min(1, v.nameRequired).max(100, v.nameMax),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE_VALUES, {
    error: v.unitRequired,
  }),
  initialStock: z.number({ error: v.stockMin }).min(0, v.stockMin),
});

export function useSupplyForm(onSubmit: (data: CreateSupplyForm) => Promise<void>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplyForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', unitOfMeasure: undefined, initialStock: 0 },
  });

  const onFormSubmit = async (data: CreateSupplyForm) => {
    await onSubmit(data);
    reset();
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
  };
}

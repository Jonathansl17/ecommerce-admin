'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { INVENTORY_STRINGS } from '../inventory.constants';
import type { UpdateSupplyForm, Supply } from '@/lib/types/inventory.types';

const { validation: v } = INVENTORY_STRINGS;

const schema = z.object({
  name: z.string().min(1, v.nameRequired).max(100, v.nameMax),
  unitOfMeasure: z.enum(['grams', 'kilograms', 'milliliters', 'liters', 'units'], {
    error: v.unitRequired,
  }),
  minThreshold: z
    .number({ invalid_type_error: v.thresholdMin })
    .min(0, v.thresholdMin),
});

export function useEditSupplyForm(
  supply: Supply | null,
  onSave: (id: string, data: UpdateSupplyForm) => Promise<void>
) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSupplyForm>({
    resolver: zodResolver(schema),
    values: supply
      ? {
          name: supply.name,
          unitOfMeasure: supply.unitOfMeasure,
          minThreshold: Number(supply.minThreshold),
        }
      : undefined,
  });

  const selectedUnit = watch('unitOfMeasure');
  const unitChanged = supply
    ? selectedUnit !== undefined && selectedUnit !== supply.unitOfMeasure
    : false;

  const onFormSubmit = async (data: UpdateSupplyForm) => {
    if (!supply) return;
    await onSave(supply.id, data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onFormSubmit),
    errors,
    isSubmitting,
    unitChanged,
  };
}

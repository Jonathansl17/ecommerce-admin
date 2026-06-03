'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_OPTIONS, UNIT_OF_MEASURE } from '../constants/inventory.constants';
import type { CreateSupplyForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.form;
const validationStrings = INVENTORY_STRINGS.validation;

const schema = z.object({
  name: z
    .string()
    .min(1, validationStrings.nameRequired)
    .max(100, validationStrings.nameMax),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE, { error: validationStrings.unitRequired }),
  initialStock: z
    .number({ error: validationStrings.stockMin })
    .min(0, validationStrings.stockMin),
});

interface SupplyFormProps {
  onSubmit: (data: CreateSupplyForm) => Promise<void>;
  serverError?: string | null;
}

export function SupplyForm({ onSubmit, serverError }: SupplyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplyForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', unitOfMeasure: undefined, initialStock: 0 },
  });

  const handleFormSubmit = async (data: CreateSupplyForm) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 rounded-lg border border-foreground/10 bg-background p-6">
      <h2 className="text-base font-semibold text-foreground">{strings.title}</h2>

      <FormField id="name" label={strings.nameLabel} error={errors.name?.message}>
        <Input
          id="name"
          placeholder={strings.namePlaceholder}
          hasError={!!errors.name}
          {...register('name')}
        />
      </FormField>

      <FormField id="unitOfMeasure" label={strings.unitLabel} error={errors.unitOfMeasure?.message}>
        <select
          id="unitOfMeasure"
          {...register('unitOfMeasure')}
          className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${errors.unitOfMeasure ? 'border-red-500' : 'border-foreground/20'}`}
        >
          <option value="">{strings.unitPlaceholder}</option>
          {UNIT_OF_MEASURE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="initialStock" label={strings.stockLabel} error={errors.initialStock?.message}>
        <Input
          id="initialStock"
          type="number"
          min={0}
          step="any"
          placeholder={strings.stockPlaceholder}
          hasError={!!errors.initialStock}
          {...register('initialStock', { valueAsNumber: true })}
        />
      </FormField>

      {serverError && (
        <p role="alert" className="text-sm text-red-500">{serverError}</p>
      )}

      <Button type="submit" isLoading={isSubmitting} loadingText={strings.submittingButton}>
        {strings.submitButton}
      </Button>
    </form>
  );
}

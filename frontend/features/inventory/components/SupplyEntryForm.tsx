'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '../constants/inventory.constants';
import type { Supply, CreateSupplyEntryForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.entry;
const validationStrings = INVENTORY_STRINGS.validation;

const schema = z.object({
  supplyId: z.string().min(1, validationStrings.supplyRequired),
  quantity: z
    .number({ invalid_type_error: validationStrings.entryQuantityMin })
    .min(0.01, validationStrings.entryQuantityMin),
  date: z.string().min(1, validationStrings.dateRequired),
});

interface SupplyEntryFormProps {
  supplies: Supply[];
  onSubmit: (data: CreateSupplyEntryForm) => Promise<void>;
  serverError?: string | null;
  defaultSupplyId?: string;
}

export function SupplyEntryForm({ supplies, onSubmit, serverError, defaultSupplyId }: SupplyEntryFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplyEntryForm>({
    resolver: zodResolver(schema),
    defaultValues: { supplyId: '', quantity: NaN, date: today },
  });

  useEffect(() => {
    if (defaultSupplyId) setValue('supplyId', defaultSupplyId);
  }, [defaultSupplyId, setValue]);

  const handleFormSubmit = async (data: CreateSupplyEntryForm) => {
    await onSubmit(data);
    reset({ supplyId: '', quantity: NaN, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 rounded-lg border border-foreground/10 bg-background p-6"
    >
      <h2 className="text-base font-semibold text-foreground">{strings.title}</h2>

      <FormField id="entry-supply" label={strings.supplyLabel} error={errors.supplyId?.message}>
        <select
          id="entry-supply"
          {...register('supplyId')}
          className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
            errors.supplyId ? 'border-red-500' : 'border-foreground/20'
          }`}
        >
          <option value="">{strings.supplyPlaceholder}</option>
          {supplies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({UNIT_OF_MEASURE_LABELS[s.unitOfMeasure]})
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="entry-quantity" label={strings.quantityLabel} error={errors.quantity?.message}>
        <Input
          id="entry-quantity"
          type="number"
          min={0.01}
          step="any"
          placeholder={strings.quantityPlaceholder}
          hasError={!!errors.quantity}
          {...register('quantity', { valueAsNumber: true })}
        />
      </FormField>

      <FormField id="entry-date" label={strings.dateLabel} error={errors.date?.message}>
        <Input
          id="entry-date"
          type="date"
          hasError={!!errors.date}
          {...register('date')}
        />
      </FormField>

      {serverError && (
        <p role="alert" className="text-sm text-red-500">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} loadingText={strings.submittingButton}>
        {strings.submitButton}
      </Button>
    </form>
  );
}

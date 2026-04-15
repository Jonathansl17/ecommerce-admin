'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_OPTIONS } from './inventory.constants';
import type { CreateSupplyForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.form;
const validationStrings = INVENTORY_STRINGS.validation;

const schema = z.object({
  name: z
    .string()
    .min(1, validationStrings.nameRequired)
    .max(100, validationStrings.nameMax),
  unitOfMeasure: z.enum(
    ['grams', 'kilograms', 'milliliters', 'liters', 'units'],
    { error: validationStrings.unitRequired }
  ),
  initialStock: z
    .number({ error: validationStrings.stockMin })
    .min(0, validationStrings.stockMin),
});

interface SupplyFormModalProps {
  onClose: () => void;
  onSubmit: (data: CreateSupplyForm) => Promise<void>;
  serverError?: string | null;
}

export function SupplyFormModal({ onClose, onSubmit, serverError }: SupplyFormModalProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="supply-form-modal-title"
      >
        <h2 id="supply-form-modal-title" className="mb-4 text-base font-semibold text-foreground">
          {strings.title}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField id="modal-name" label={strings.nameLabel} error={errors.name?.message}>
            <Input
              id="modal-name"
              placeholder={strings.namePlaceholder}
              hasError={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField id="modal-unit" label={strings.unitLabel} error={errors.unitOfMeasure?.message}>
            <select
              id="modal-unit"
              {...register('unitOfMeasure')}
              className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
                errors.unitOfMeasure ? 'border-red-500' : 'border-foreground/20'
              }`}
            >
              <option value="">{strings.unitPlaceholder}</option>
              {UNIT_OF_MEASURE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="modal-stock" label={strings.stockLabel} error={errors.initialStock?.message}>
            <Input
              id="modal-stock"
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {strings.cancelButton}
            </button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={strings.submittingButton}
              className="w-auto px-4"
            >
              {strings.submitButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

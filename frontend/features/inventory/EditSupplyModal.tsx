'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UNIT_OF_MEASURE_OPTIONS, INVENTORY_STRINGS } from './inventory.constants';
import type { Supply, UpdateSupplyForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.edit;
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
  minThreshold: z
    .number({ invalid_type_error: validationStrings.thresholdMin })
    .min(0, validationStrings.thresholdMin),
});

interface EditSupplyModalProps {
  supply: Supply | null;
  onClose: () => void;
  onSave: (id: string, data: UpdateSupplyForm) => Promise<void>;
  serverError?: string | null;
}

export function EditSupplyModal({ supply, onClose, onSave, serverError }: EditSupplyModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSupplyForm>({
    resolver: zodResolver(schema),
    values: supply
      ? { name: supply.name, unitOfMeasure: supply.unitOfMeasure, minThreshold: Number(supply.minThreshold) }
      : undefined,
  });

  if (!supply) return null;

  const selectedUnit = watch('unitOfMeasure');
  const unitChanged = selectedUnit !== undefined && selectedUnit !== supply.unitOfMeasure;

  const handleFormSubmit = async (data: UpdateSupplyForm) => {
    await onSave(supply.id, data);
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
        aria-labelledby="edit-modal-title"
      >
        <h2 id="edit-modal-title" className="mb-4 text-base font-semibold text-foreground">
          {strings.title}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField id="edit-name" label={strings.nameLabel} error={errors.name?.message}>
            <Input
              id="edit-name"
              placeholder={strings.namePlaceholder}
              hasError={!!errors.name}
              {...register('name')}
            />
          </FormField>

          <FormField id="edit-unit" label={strings.unitLabel} error={errors.unitOfMeasure?.message}>
            <select
              id="edit-unit"
              {...register('unitOfMeasure')}
              className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${errors.unitOfMeasure ? 'border-red-500' : 'border-foreground/20'}`}
            >
              {UNIT_OF_MEASURE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="edit-stock" label={strings.stockLabel}>
            <input
              id="edit-stock"
              type="number"
              value={Number(supply.currentStock)}
              readOnly
              className="w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-foreground/60 cursor-not-allowed"
            />
          </FormField>

          <FormField id="edit-threshold" label={strings.thresholdLabel} error={errors.minThreshold?.message}>
            <Input
              id="edit-threshold"
              type="number"
              min={0}
              step="any"
              placeholder={strings.thresholdPlaceholder}
              hasError={!!errors.minThreshold}
              {...register('minThreshold', { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-foreground/50">{strings.thresholdHint}</p>
          </FormField>

          {unitChanged && (
            <p role="alert" className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              {strings.unitChangeWarning}
            </p>
          )}

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
              loadingText={strings.savingButton}
              className="w-auto px-4"
            >
              {strings.saveButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from './inventory.constants';
import type { Supply, CreateSupplyEntriesForm } from '@/lib/types/inventory.types';

const strings = INVENTORY_STRINGS.entry;
const validationStrings = INVENTORY_STRINGS.validation;

const schema = z.object({
  items: z
    .array(z.object({
      supplyId: z.string().min(1, validationStrings.supplyRequired),
      quantity: z
        .number({ invalid_type_error: validationStrings.entryQuantityMin })
        .min(0.01, validationStrings.entryQuantityMin),
    }))
    .min(1, validationStrings.itemsRequired),
  date: z.string().min(1, validationStrings.dateRequired),
});

interface SupplyEntryModalProps {
  supplies: Supply[];
  onClose: () => void;
  onSubmit: (data: CreateSupplyEntriesForm) => Promise<void>;
  serverError?: string | null;
  defaultSupplyId?: string;
}

export function SupplyEntryModal({ supplies, onClose, onSubmit, serverError, defaultSupplyId }: SupplyEntryModalProps) {
  const today = new Date().toISOString().split('T')[0];

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
      date: today,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  useEffect(() => {
    if (defaultSupplyId) {
      reset({
        items: [{ supplyId: defaultSupplyId, quantity: NaN }],
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [defaultSupplyId, reset]);

  const handleFormSubmit = async (data: CreateSupplyEntriesForm) => {
    await onSubmit(data);
    reset({ items: [{ supplyId: '', quantity: NaN }], date: new Date().toISOString().split('T')[0] });
  };

  // Returns available supplies for a given row index (excludes already selected in other rows)
  const availableSupplies = (index: number) => {
    const selectedIds = watchedItems
      .map((item, i) => (i !== index ? item.supplyId : null))
      .filter(Boolean);
    return supplies.filter((s) => !selectedIds.includes(s.id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg border border-foreground/10 bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
      >
        {/* Header */}
        <div className="border-b border-foreground/10 px-6 py-4">
          <h2 id="entry-modal-title" className="text-base font-semibold text-foreground">
            {strings.title}
          </h2>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4">
          <form id="entry-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Date */}
            <FormField id="entry-date" label={strings.dateLabel} error={errors.date?.message}>
              <Input id="entry-date" type="date" hasError={!!errors.date} {...register('date')} />
            </FormField>

            {/* Items */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-foreground/10 bg-foreground/[0.02] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground/60">Insumo {index + 1}</span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        {strings.removeItemButton}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_120px] gap-3">
                    <FormField
                      id={`entry-supply-${index}`}
                      label={strings.supplyLabel}
                      error={errors.items?.[index]?.supplyId?.message}
                    >
                      <select
                        id={`entry-supply-${index}`}
                        {...register(`items.${index}.supplyId`)}
                        className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
                          errors.items?.[index]?.supplyId ? 'border-red-500' : 'border-foreground/20'
                        }`}
                      >
                        <option value="">{strings.supplyPlaceholder}</option>
                        {availableSupplies(index).map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({UNIT_OF_MEASURE_LABELS[s.unitOfMeasure]})
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      id={`entry-qty-${index}`}
                      label={strings.quantityLabel}
                      labelClassName="text-xs"
                      error={errors.items?.[index]?.quantity?.message}
                    >
                      <Input
                        id={`entry-qty-${index}`}
                        type="number"
                        min={0.01}
                        step="any"
                        placeholder={strings.quantityPlaceholder}
                        hasError={!!errors.items?.[index]?.quantity}
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                    </FormField>
                  </div>
                </div>
              ))}

              {errors.items?.root?.message && (
                <p className="text-sm text-red-500">{errors.items.root.message}</p>
              )}

              {fields.length < supplies.length && (
                <button
                  type="button"
                  onClick={() => append({ supplyId: '', quantity: NaN })}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {strings.addItemButton}
                </button>
              )}
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-red-500">{serverError}</p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-foreground/10 px-6 py-4">
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
            form="entry-form"
            isLoading={isSubmitting}
            loadingText={strings.submittingButton}
            className="w-auto px-4"
          >
            {strings.submitButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

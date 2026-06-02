'use client';

import { useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { SupplyItemRow } from './SupplyItemRow';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_LABELS } from '../constants/inventory.constants';
import { useConsumptionForm } from '../hooks/useConsumptionForm';
import type { ConsumptionModalProps } from '../types/inventory.modal.types';

const strings = INVENTORY_STRINGS.consumption;

export function ConsumptionModal({ supplies, onClose, onSubmit, serverError }: ConsumptionModalProps) {
  const { register, handleSubmit, fields, append, remove, availableSupplies, watchedItems, errors, isSubmitting, suppliesCount } =
    useConsumptionForm(supplies, onSubmit);

  const suppliesById = useMemo(
    () => new Map(supplies.map((s) => [s.id, s])),
    [supplies]
  );

  const footer = (
    <>
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
        form="consumption-form"
        isLoading={isSubmitting}
        loadingText={strings.submittingButton}
        className="w-auto px-4"
      >
        {strings.submitButton}
      </Button>
    </>
  );

  return (
    <Modal
      titleId="consumption-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      disableBackdropClose
    >
      <form id="consumption-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField id="consumption-reference" label={strings.referenceLabel}>
          <Input
            id="consumption-reference"
            placeholder={strings.referencePlaceholder}
            {...register('reference')}
          />
        </FormField>

        <FormField id="consumption-date" label={strings.dateLabel} error={errors.date?.message}>
          <Input
            id="consumption-date"
            type="date"
            hasError={!!errors.date}
            {...register('date')}
          />
        </FormField>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedSupply = suppliesById.get(watchedItems[index]?.supplyId);
            return (
              <div key={field.id} className="space-y-1">
                <SupplyItemRow
                  index={index}
                  availableSupplies={availableSupplies(index)}
                  showRemove={fields.length > 1}
                  onRemove={() => remove(index)}
                  removeLabel={strings.removeItemButton}
                  supplyLabel={strings.supplyLabel}
                  supplyPlaceholder={strings.supplyPlaceholder}
                  quantityLabel={strings.quantityLabel}
                  quantityPlaceholder={strings.quantityPlaceholder}
                  register={register as Parameters<typeof SupplyItemRow>[0]['register']}
                  errors={errors}
                />
                {selectedSupply && (
                  <p className="px-1 text-xs text-foreground/50">
                    {strings.stockAvailableLabel}{' '}
                    <span className="font-medium text-foreground/70">
                      {Number(selectedSupply.currentStock)}{' '}
                      {UNIT_OF_MEASURE_LABELS[selectedSupply.unitOfMeasure]}
                    </span>
                  </p>
                )}
              </div>
            );
          })}

          {errors.items?.root?.message && (
            <p className="text-sm text-red-500">{errors.items.root.message}</p>
          )}

          {fields.length < suppliesCount && (
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
    </Modal>
  );
}

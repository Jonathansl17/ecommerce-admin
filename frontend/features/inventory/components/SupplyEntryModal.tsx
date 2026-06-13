'use client';

import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { SupplyItemRow } from './SupplyItemRow';
import { INVENTORY_STRINGS } from '../constants/inventory.constants';
import { useSupplyEntryForm } from '../hooks/useSupplyEntryForm';
import type { SupplyEntryModalProps } from '../types/inventory.modal.types';

const strings = INVENTORY_STRINGS.entry;

export function SupplyEntryModal({ supplies, onClose, onSubmit, serverError, defaultSupplyId }: SupplyEntryModalProps) {
  const { register, handleSubmit, fields, append, remove, availableSupplies, errors, isSubmitting, suppliesCount } =
    useSupplyEntryForm(supplies, onSubmit, defaultSupplyId);

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
        form="entry-form"
        isLoading={isSubmitting}
        loadingText={strings.submittingButton}
      >
        {strings.submitButton}
      </Button>
    </>
  );

  return (
    <Modal
      titleId="entry-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      disableBackdropClose
    >
      <form id="entry-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField id="entry-date" label={strings.dateLabel} error={errors.date?.message}>
          <Input id="entry-date" type="date" hasError={!!errors.date} {...register('date')} />
        </FormField>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <SupplyItemRow
              key={field.id}
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
          ))}

          {errors.items?.root?.message && (
            <p className="text-sm text-red-500">{errors.items.root.message}</p>
          )}

          {fields.length < suppliesCount && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => append({ supplyId: '', quantity: NaN })}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {strings.addItemButton}
            </Button>
          )}
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-red-500">{serverError}</p>
        )}
      </form>
    </Modal>
  );
}

'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { INVENTORY_STRINGS, UNIT_OF_MEASURE_OPTIONS } from '../constants/inventory.constants';
import { useSupplyForm } from '../hooks/useSupplyForm';
import type { SupplyFormModalProps } from '../types/inventory.modal.types';

const strings = INVENTORY_STRINGS.form;

export function SupplyFormModal({ onClose, onSubmit, serverError }: SupplyFormModalProps) {
  const { register, handleSubmit, errors, isSubmitting } = useSupplyForm(onSubmit);

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
        form="supply-form"
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
      titleId="supply-form-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <form id="supply-form" onSubmit={handleSubmit} className="space-y-4">
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
      </form>
    </Modal>
  );
}

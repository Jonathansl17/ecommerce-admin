'use client';

import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UNIT_OF_MEASURE_OPTIONS, INVENTORY_STRINGS } from '../constants/inventory.constants';
import { useEditSupplyForm } from '../hooks/useEditSupplyForm';
import type { EditSupplyModalProps } from '../types/inventory.modal.types';

const strings = INVENTORY_STRINGS.edit;

export function EditSupplyModal({ supply, onClose, onSave, serverError }: EditSupplyModalProps) {
  const { register, handleSubmit, errors, isSubmitting, unitChanged } = useEditSupplyForm(supply, onSave);

  if (!supply) return null;

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
        form="edit-supply-form"
        isLoading={isSubmitting}
        loadingText={strings.savingButton}
        className="w-auto px-4"
      >
        {strings.saveButton}
      </Button>
    </>
  );

  return (
    <Modal
      titleId="edit-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <form id="edit-supply-form" onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
              errors.unitOfMeasure ? 'border-red-500' : 'border-foreground/20'
            }`}
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
      </form>
    </Modal>
  );
}

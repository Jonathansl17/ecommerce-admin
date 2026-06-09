'use client';

import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStockAdjustmentForm } from '../hooks/useStockAdjustmentForm';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_ADJUSTMENT_REASON_OPTIONS, STOCK_ADJUSTMENT_VALIDATION } from '../constants/validation';
import type { Product, AdjustStockForm } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.adjust;

interface StockAdjustmentModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (id: string, data: AdjustStockForm) => Promise<void>;
  serverError?: string | null;
}

export function StockAdjustmentModal({
  product,
  onClose,
  onSave,
  serverError,
}: StockAdjustmentModalProps) {
  const { register, handleSubmit, errors, isSubmitting } = useStockAdjustmentForm(product, onSave);

  if (!product) return null;

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
        form="adjust-form"
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
      titleId="adjust-modal-title"
      title={`${strings.title} — ${product.name}`}
      onClose={onClose}
      footer={footer}
      size="sm"
      disableBackdropClose
    >
      <form id="adjust-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField id="adjust-current-stock" label={strings.currentStockLabel}>
          <input
            id="adjust-current-stock"
            type="number"
            value={product.currentStock}
            readOnly
            className="w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-foreground/60 cursor-not-allowed"
          />
        </FormField>

        <FormField id="adjust-new-stock" label={strings.newStockLabel} error={errors.newStock?.message}>
          <Input
            id="adjust-new-stock"
            type="number"
            min={STOCK_ADJUSTMENT_VALIDATION.NEW_STOCK_MIN}
            step="1"
            placeholder={strings.newStockPlaceholder}
            hasError={!!errors.newStock}
            {...register('newStock', { valueAsNumber: true })}
          />
        </FormField>

        <FormField id="adjust-reason" label={strings.reasonLabel} error={errors.reason?.message}>
          <select
            id="adjust-reason"
            {...register('reason')}
            className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
              errors.reason ? 'border-red-500' : 'border-foreground/20'
            }`}
          >
            {STOCK_ADJUSTMENT_REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="adjust-note" label={strings.noteLabel} error={errors.note?.message}>
          <textarea
            id="adjust-note"
            placeholder={strings.notePlaceholder}
            maxLength={STOCK_ADJUSTMENT_VALIDATION.NOTE_MAX_LENGTH}
            rows={3}
            {...register('note')}
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 resize-none ${
              errors.note ? 'border-red-500' : 'border-foreground/20'
            }`}
          />
          <p className="mt-1 text-xs text-foreground/50">{strings.noteHint}</p>
        </FormField>

        {serverError && (
          <p role="alert" className="text-sm text-red-500">
            {serverError}
          </p>
        )}
      </form>
    </Modal>
  );
}

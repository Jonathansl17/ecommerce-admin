'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adjustStockSchema } from '../shared/validators';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { STOCK_ADJUSTMENT_REASON_OPTIONS, STOCK_ADJUSTMENT_VALIDATION } from '../constants/validation';
import type { AdjustStockForm } from '../types/products.types';
import type { Supply } from '@/lib/types/inventory.types';

const strings = PRODUCTS_MESSAGES.adjust;

interface StockAdjustmentModalProps {
  supply: Supply | null;
  onClose: () => void;
  onSave: (id: string, data: AdjustStockForm) => Promise<void>;
  serverError?: string | null;
}

export function StockAdjustmentModal({ supply, onClose, onSave, serverError }: StockAdjustmentModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdjustStockForm>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: { reason: 'manual_adjustment' },
  });

  if (!supply) return null;

  const handleFormSubmit = async (data: AdjustStockForm) => {
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
        aria-labelledby="adjust-modal-title"
      >
        <h2 id="adjust-modal-title" className="mb-4 text-base font-semibold text-foreground">
          {strings.title} — {supply.name}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField id="adjust-current-stock" label={strings.currentStockLabel}>
            <input
              id="adjust-current-stock"
              type="number"
              value={Number(supply.currentStock)}
              readOnly
              className="w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-foreground/60 cursor-not-allowed"
            />
          </FormField>

          <FormField id="adjust-new-stock" label={strings.newStockLabel} error={errors.newStock?.message}>
            <Input
              id="adjust-new-stock"
              type="number"
              min={STOCK_ADJUSTMENT_VALIDATION.NEW_STOCK_MIN}
              step="any"
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

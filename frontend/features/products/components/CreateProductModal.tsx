'use client';

import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreateProductForm } from '../hooks/useCreateProductForm';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import { CREATE_PRODUCT_VALIDATION, PRODUCT_STATUS_OPTIONS } from '../constants/validation';
import type { CreateProductFormData } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.create;

interface CreateProductModalProps {
  onClose: () => void;
  onSave: (data: CreateProductFormData) => Promise<void>;
  serverError?: string | null;
}

export function CreateProductModal({ onClose, onSave, serverError }: CreateProductModalProps) {
  const { register, handleSubmit, errors, isSubmitting } = useCreateProductForm(onSave);

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
        form="create-product-form"
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
      titleId="create-product-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="md"
    >
      <form id="create-product-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField id="create-name" label={strings.nameLabel} error={errors.name?.message}>
          <Input
            id="create-name"
            type="text"
            placeholder={strings.namePlaceholder}
            maxLength={CREATE_PRODUCT_VALIDATION.NAME.MAX_LENGTH}
            hasError={!!errors.name}
            {...register('name')}
          />
        </FormField>

        <FormField
          id="create-description"
          label={strings.descriptionLabel}
          error={errors.description?.message}
        >
          <textarea
            id="create-description"
            placeholder={strings.descriptionPlaceholder}
            maxLength={CREATE_PRODUCT_VALIDATION.DESCRIPTION.MAX_LENGTH}
            rows={3}
            {...register('description')}
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 resize-none ${
              errors.description ? 'border-red-500' : 'border-foreground/20'
            }`}
          />
        </FormField>

        <FormField id="create-price" label={strings.priceLabel} error={errors.price?.message}>
          <Input
            id="create-price"
            type="number"
            min={CREATE_PRODUCT_VALIDATION.PRICE.MIN}
            max={CREATE_PRODUCT_VALIDATION.PRICE.MAX}
            step="0.01"
            placeholder={strings.pricePlaceholder}
            hasError={!!errors.price}
            {...register('price', { valueAsNumber: true })}
          />
        </FormField>

        <FormField id="create-status" label={strings.statusLabel} error={errors.status?.message}>
          <select
            id="create-status"
            {...register('status')}
            className={`w-full rounded-md border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 ${
              errors.status ? 'border-red-500' : 'border-foreground/20'
            }`}
          >
            {PRODUCT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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

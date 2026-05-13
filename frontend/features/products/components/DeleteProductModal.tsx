'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PRODUCTS_MESSAGES } from '../constants/messages';
import type { Product } from '../types/products.types';

const strings = PRODUCTS_MESSAGES.delete;

interface DeleteProductModalProps {
  product: Product;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  serverError?: string | null;
}

export function DeleteProductModal({
  product,
  isDeleting,
  onClose,
  onConfirm,
  serverError,
}: DeleteProductModalProps) {
  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={isDeleting}
        className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {strings.cancelButton}
      </button>
      <Button
        type="button"
        isLoading={isDeleting}
        loadingText={strings.deletingButton}
        onClick={onConfirm}
        className="w-auto px-4 bg-red-600 hover:bg-red-700"
      >
        {strings.deleteButton}
      </Button>
    </>
  );

  return (
    <Modal
      titleId="delete-product-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <p className="text-sm text-foreground/80">
        {strings.confirmMessage(product.name)}
      </p>

      {serverError && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {serverError}
        </p>
      )}
    </Modal>
  );
}

'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { INVENTORY_STRINGS } from '../constants/inventory.constants';
import type { DeleteSupplyModalProps } from '../types/inventory.modal.types';

const strings = INVENTORY_STRINGS.delete;

export function DeleteSupplyModal({ supply, isDeleting, onClose, onConfirm, serverError }: DeleteSupplyModalProps) {
  if (!supply) return null;

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
        variant="destructive"
        isLoading={isDeleting}
        loadingText={strings.deletingButton}
        onClick={onConfirm}
      >
        {strings.deleteButton}
      </Button>
    </>
  );

  return (
    <Modal
      titleId="delete-supply-modal-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <p className="text-sm text-foreground/80">
        {strings.confirmMessage(supply.name)}
      </p>

      {serverError && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {serverError}
        </p>
      )}
    </Modal>
  );
}

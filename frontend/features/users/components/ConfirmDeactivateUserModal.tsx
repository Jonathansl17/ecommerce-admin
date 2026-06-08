'use client';

import { Modal } from '@/components/ui/Modal';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { ConfirmDeactivateUserModalProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.confirmDeactivate;

export function ConfirmDeactivateUserModal({ userName, onClose, onConfirm }: ConfirmDeactivateUserModalProps) {
  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md border border-foreground/20 px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        {strings.cancelButton}
      </button>
      <button
        type="button"
        onClick={() => {
          onClose();
          onConfirm();
        }}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        {strings.confirmButton}
      </button>
    </>
  );

  return (
    <Modal
      titleId="confirm-deactivate-user-title"
      title={strings.title}
      onClose={onClose}
      footer={footer}
      size="sm"
    >
      <p className="text-sm text-foreground/80">{strings.message(userName)}</p>
    </Modal>
  );
}

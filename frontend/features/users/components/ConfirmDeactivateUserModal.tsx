'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { USERS_MESSAGES } from '@/features/users/constants/messages';
import { ConfirmDeactivateUserModalProps } from '@/features/users/types/users.types';

const strings = USERS_MESSAGES.confirmDeactivate;

export function ConfirmDeactivateUserModal({ userName, onClose, onConfirm }: ConfirmDeactivateUserModalProps) {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        {strings.cancelButton}
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          onClose();
          onConfirm();
        }}
      >
        {strings.confirmButton}
      </Button>
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

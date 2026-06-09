'use client';

import { useState } from 'react';
import { APPROVE_PAYMENT_BTN_COLOR, ORDERS_STRINGS } from '../constants/orders.constants';
import type { ApprovePaymentButtonProps } from '../types/orders.types';
import { ConfirmApproveDialog } from './ConfirmApproveDialog';

const { status: s } = ORDERS_STRINGS;

export function ApprovePaymentButton({
  currentStatus,
  paymentStatus,
  disabled,
  onApprove,
}: ApprovePaymentButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (currentStatus !== 'pending_payment' || paymentStatus === 'approved') return null;

  if (confirming) {
    return (
      <ConfirmApproveDialog
        disabled={disabled}
        onConfirm={() => {
          setConfirming(false);
          onApprove();
        }}
        onCancel={() => setConfirming(false)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      disabled={disabled}
      className="inline-flex items-center rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
      style={{ backgroundColor: APPROVE_PAYMENT_BTN_COLOR }}
      aria-label={s.approvePaymentButton}
    >
      {s.approvePaymentButton}
    </button>
  );
}

'use client';

import { useState } from 'react';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderStatus } from '../types/orders.types';

const { status: s } = ORDERS_STRINGS;

interface ApprovePaymentButtonProps {
  currentStatus: OrderStatus;
  paymentStatus: string;
  disabled: boolean;
  onApprove: () => void;
}

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
      <div
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        role="alertdialog"
        aria-labelledby="approve-confirm-title"
        aria-describedby="approve-confirm-desc"
      >
        <p id="approve-confirm-title" className="text-sm font-semibold text-foreground">
          {s.confirmApproveTitle}
        </p>
        <p id="approve-confirm-desc" className="text-sm text-muted-foreground">
          {s.confirmApproveMessage}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              onApprove();
            }}
            disabled={disabled}
            className="inline-flex items-center rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#16a34a' }}
          >
            {disabled ? '...' : s.confirmApproveAccept}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={disabled}
            className="inline-flex items-center rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {s.confirmApproveDismiss}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      disabled={disabled}
      className="inline-flex items-center rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
      style={{ backgroundColor: '#16a34a' }}
      aria-label={s.approvePaymentButton}
    >
      {s.approvePaymentButton}
    </button>
  );
}

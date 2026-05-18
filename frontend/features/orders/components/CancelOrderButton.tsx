'use client';

import { useState } from 'react';
import { ORDERS_STRINGS } from '../constants/orders.constants';
import type { OrderStatus } from '../types/orders.types';

const { status: s } = ORDERS_STRINGS;

interface CancelOrderButtonProps {
  currentStatus: OrderStatus;
  disabled: boolean;
  onCancel: () => void;
}

export function CancelOrderButton({
  currentStatus,
  disabled,
  onCancel,
}: CancelOrderButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (currentStatus !== 'pending_payment') return null;

  if (confirming) {
    return (
      <div
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
        role="alertdialog"
        aria-labelledby="cancel-confirm-title"
        aria-describedby="cancel-confirm-desc"
      >
        <p id="cancel-confirm-title" className="text-sm font-semibold text-foreground">
          {s.confirmCancelTitle}
        </p>
        <p id="cancel-confirm-desc" className="text-sm text-muted-foreground">
          {s.confirmCancelMessage}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
              onCancel();
            }}
            disabled={disabled}
            className="inline-flex items-center rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#ef4444' }}
          >
            {disabled ? s.cancellingButton : s.confirmCancelAccept}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={disabled}
            className="inline-flex items-center rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {s.confirmCancelDismiss}
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
      style={{ backgroundColor: '#ef4444' }}
      aria-label={s.cancelButton}
    >
      {s.cancelButton}
    </button>
  );
}

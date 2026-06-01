'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NotificationPreference, SaveState, ToggleRowProps } from '../types/notifications.types';
import { getPreferences, updatePreferences } from '../shared/notifications.api';
import { NOTIFICATION_PREFERENCES_STRINGS as strings } from '../constants/notifications.constants';
import { Toast, ToastContainer, type ToastItem, type ToastVariant } from '@/components/ui/Toast';

function ToggleRow({ id, label, checked, disabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm text-foreground cursor-pointer">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        disabled={disabled}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-muted',
        ].join(' ')}
        aria-label={label}
      >
        <span
          className={[
            'inline-block h-4 w-4 rounded-full bg-primary-foreground shadow-sm transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function NotificationPreferences() {
  const [preference, setPreference] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPreferences();
      setPreference(data);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleToggle = useCallback(
    async (field: 'receiveOrderNotifications' | 'receiveReviewNotifications') => {
      if (!preference || saveState === 'saving') return;

      const next = !preference[field];
      setPreference((prev) => (prev ? { ...prev, [field]: next } : prev));
      setSaveState('saving');

      try {
        const updated = await updatePreferences({ [field]: next });
        setPreference(updated);
        showToast(strings.savedToast, 'success');
      } catch {
        setPreference((prev) => (prev ? { ...prev, [field]: !next } : prev));
        showToast(strings.errorToast, 'error');
      } finally {
        setSaveState('idle');
      }
    },
    [preference, saveState, showToast]
  );

  return (
    <>
      <section
        aria-labelledby="preferences-heading"
        className="rounded-lg border border-border bg-card p-4"
      >
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{strings.loading}</p>
        ) : preference ? (
          <div className="space-y-4">
            <ToggleRow
              id="order-notifications-toggle"
              label={strings.orderNotificationsLabel}
              checked={preference.receiveOrderNotifications}
              disabled={saveState === 'saving'}
              onToggle={() => handleToggle('receiveOrderNotifications')}
            />
            <ToggleRow
              id="review-notifications-toggle"
              label={strings.reviewNotificationsLabel}
              checked={preference.receiveReviewNotifications}
              disabled={saveState === 'saving'}
              onToggle={() => handleToggle('receiveReviewNotifications')}
            />
          </div>
        ) : null}
      </section>

      <ToastContainer>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            variant={t.variant}
            onDismiss={() => dismissToast(t.id)}
          />
        ))}
      </ToastContainer>
    </>
  );
}

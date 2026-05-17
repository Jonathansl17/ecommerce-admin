'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NotificationPreference } from '../types/notifications.types';
import { getPreferences, updatePreferences } from '../shared/notifications.api';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.preferences;
const pageStrings = NOTIFICATION_STRINGS.page;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface ToggleRowProps {
  id: string;
  label: string;
  checked: boolean;
  saveState: SaveState;
  onToggle: () => void;
}

function SaveFeedback({ saveState }: { saveState: SaveState }) {
  if (saveState === 'saving') {
    return <span className="text-xs text-muted-foreground">{strings.saving}</span>;
  }
  if (saveState === 'saved') {
    return (
      <span className="text-xs text-green-600" role="status">
        {strings.saved}
      </span>
    );
  }
  if (saveState === 'error') {
    return (
      <span className="text-xs text-destructive" role="alert">
        {strings.error}
      </span>
    );
  }
  return null;
}

function ToggleRow({ id, label, checked, saveState, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm text-foreground cursor-pointer">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <SaveFeedback saveState={saveState} />

        <button
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={onToggle}
          disabled={saveState === 'saving'}
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
    </div>
  );
}

export function NotificationPreferences() {
  const [preference, setPreference] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderSaveState, setOrderSaveState] = useState<SaveState>('idle');
  const [reviewSaveState, setReviewSaveState] = useState<SaveState>('idle');

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPreferences();
      setPreference(data);
    } catch {
      // Silently fail; toggles will be absent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleOrderToggle = async () => {
    if (!preference) return;

    const next = !preference.receiveOrderNotifications;

    setPreference((prev) => (prev ? { ...prev, receiveOrderNotifications: next } : prev));
    setOrderSaveState('saving');

    try {
      const updated = await updatePreferences({ receiveOrderNotifications: next });
      setPreference(updated);
      setOrderSaveState('saved');
      setTimeout(() => setOrderSaveState('idle'), 2000);
    } catch {
      setPreference((prev) =>
        prev ? { ...prev, receiveOrderNotifications: !next } : prev
      );
      setOrderSaveState('error');
      setTimeout(() => setOrderSaveState('idle'), 3000);
    }
  };

  const handleReviewToggle = async () => {
    if (!preference) return;

    const next = !preference.receiveReviewNotifications;

    setPreference((prev) => (prev ? { ...prev, receiveReviewNotifications: next } : prev));
    setReviewSaveState('saving');

    try {
      const updated = await updatePreferences({ receiveReviewNotifications: next });
      setPreference(updated);
      setReviewSaveState('saved');
      setTimeout(() => setReviewSaveState('idle'), 2000);
    } catch {
      setPreference((prev) =>
        prev ? { ...prev, receiveReviewNotifications: !next } : prev
      );
      setReviewSaveState('error');
      setTimeout(() => setReviewSaveState('idle'), 3000);
    }
  };

  return (
    <section
      aria-labelledby="preferences-heading"
      className="rounded-lg border border-border bg-card p-4"
    >
      <h2
        id="preferences-heading"
        className="text-sm font-semibold text-foreground mb-4"
      >
        {pageStrings.settingsTitle}
      </h2>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{strings.loading}</p>
      ) : preference ? (
        <div className="space-y-4">
          <ToggleRow
            id="order-notifications-toggle"
            label={strings.orderNotificationsLabel}
            checked={preference.receiveOrderNotifications}
            saveState={orderSaveState}
            onToggle={handleOrderToggle}
          />
          <ToggleRow
            id="review-notifications-toggle"
            label={strings.reviewNotificationsLabel}
            checked={preference.receiveReviewNotifications}
            saveState={reviewSaveState}
            onToggle={handleReviewToggle}
          />
        </div>
      ) : null}
    </section>
  );
}

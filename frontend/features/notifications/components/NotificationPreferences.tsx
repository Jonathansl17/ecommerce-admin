'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NotificationPreference } from '../types/notifications.types';
import { getPreferences, updatePreferences } from '../shared/notifications.api';
import { NOTIFICATION_STRINGS } from '../constants/notifications.constants';

const strings = NOTIFICATION_STRINGS.preferences;
const pageStrings = NOTIFICATION_STRINGS.page;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function NotificationPreferences() {
  const [preference, setPreference] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPreferences();
      setPreference(data);
    } catch {
      // Silently fail; toggle will be absent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleToggle = async () => {
    if (!preference) return;

    const next = !preference.receiveOrderNotifications;

    // Optimistic update
    setPreference((prev) => (prev ? { ...prev, receiveOrderNotifications: next } : prev));
    setSaveState('saving');

    try {
      const updated = await updatePreferences({ receiveOrderNotifications: next });
      setPreference(updated);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch {
      // Rollback
      setPreference((prev) => (prev ? { ...prev, receiveOrderNotifications: !next } : prev));
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  return (
    <section aria-labelledby="preferences-heading" className="rounded-lg border border-border bg-card p-4">
      <h2 id="preferences-heading" className="text-sm font-semibold text-foreground mb-4">
        {pageStrings.settingsTitle}
      </h2>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{strings.loading}</p>
      ) : preference ? (
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="order-notifications-toggle"
            className="text-sm text-foreground cursor-pointer"
          >
            {strings.orderNotificationsLabel}
          </label>

          <div className="flex items-center gap-2">
            {saveState === 'saving' && (
              <span className="text-xs text-muted-foreground">{strings.saving}</span>
            )}
            {saveState === 'saved' && (
              <span className="text-xs text-green-600" role="status">{strings.saved}</span>
            )}
            {saveState === 'error' && (
              <span className="text-xs text-destructive" role="alert">{strings.error}</span>
            )}

            <button
              id="order-notifications-toggle"
              role="switch"
              aria-checked={preference.receiveOrderNotifications}
              onClick={handleToggle}
              disabled={saveState === 'saving'}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                preference.receiveOrderNotifications ? 'bg-primary' : 'bg-muted',
              ].join(' ')}
              aria-label={strings.orderNotificationsLabel}
            >
              <span
                className={[
                  'inline-block h-4 w-4 rounded-full bg-primary-foreground shadow-sm transition-transform',
                  preference.receiveOrderNotifications ? 'translate-x-6' : 'translate-x-1',
                ].join(' ')}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

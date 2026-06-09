'use client';

import { NotificationPreferences } from '@/features/notifications/components/NotificationPreferences';
import { NOTIFICATION_STRINGS } from '@/features/notifications/constants/notifications.constants';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          {NOTIFICATION_STRINGS.page.settingsTitle}
        </h2>
        <NotificationPreferences />
      </section>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/constants/api.constants';
import type { Notification } from '../types/notifications.types';

interface UseSSENotificationsOptions {
  onNewNotification: (notification: Notification) => void;
}

interface UseSSENotificationsResult {
  isConnected: boolean;
}

export function useSSENotifications({
  onNewNotification,
}: UseSSENotificationsOptions): UseSSENotificationsResult {
  const [isConnected, setIsConnected] = useState(false);
  const onNewNotificationRef = useRef(onNewNotification);

  // Keep the callback ref current without re-triggering the effect
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  });

  useEffect(() => {
    const url = `${API_BASE_URL}/notifications/stream`;
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      setIsConnected(true);
    };

    es.addEventListener('new_order', (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data as string) as { notification: Notification };
        onNewNotificationRef.current(payload.notification);
      } catch {
        // Malformed SSE payload — ignore
      }
    });

    es.onerror = () => {
      setIsConnected(false);
      // EventSource reconnects automatically; no manual action needed
    };

    return () => {
      es.close();
      setIsConnected(false);
    };
  }, []); // single connection for component lifetime

  return { isConnected };
}

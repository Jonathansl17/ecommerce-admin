'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getNotifications,
  updateCustomizationStatus as apiUpdateCustomizationStatus,
} from '@/features/notifications/shared/notifications.api';
import type { Notification, OrderNotificationContent } from '@/features/notifications/types/notifications.types';
import { parseNotificationContent, isCustomizableOrder } from '@/lib/utils/notifications';
import type { CustomOrder, UseCustomOrdersResult } from '../types/customOrders.types';

export type { CustomOrder } from '../types/customOrders.types';

export function useCustomOrders(): UseCustomOrdersResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const all = await getNotifications();
      setNotifications(all.filter(isCustomizableOrder));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const notificationsRef = useRef(notifications);
  useEffect(() => { notificationsRef.current = notifications; }, [notifications]);

  const updateStatus = useCallback(
    async (id: string, status: 'accepted' | 'rejected', reason?: string) => {
      const previous = notificationsRef.current;

      setNotifications((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          const parsed = parseNotificationContent<OrderNotificationContent>(n.content);
          if (!parsed) return n;
          const updated: OrderNotificationContent = {
            ...parsed,
            customizationStatus: status,
            ...(reason ? { customizationRejectionReason: reason } : {}),
          };
          return { ...n, content: JSON.stringify(updated) };
        }),
      );

      try {
        await apiUpdateCustomizationStatus(id, status, reason);
      } catch {
        setNotifications(previous);
      }
    },
    [],
  );

  const orders: CustomOrder[] = notifications.reduce<CustomOrder[]>((acc, n) => {
    const content = parseNotificationContent<OrderNotificationContent>(n.content);
    if (content) acc.push({ notification: n, content });
    return acc;
  }, []);

  const pendingCount = orders.filter((o) => !o.content.customizationStatus).length;

  return {
    orders,
    isLoading,
    isError,
    pendingCount,
    updateStatus,
    refetch: loadData,
  };
}

import type { Notification, OrderNotificationContent } from '@/features/notifications/types/notifications.types';
import { CARD_BORDER_COLORS } from '@/features/notifications/constants/notifications.constants';

export function getCardBorderStyle(
  isNegativeReview: boolean,
  isOrderWithCustomization: boolean,
  read: boolean,
): { borderLeftColor: string } | undefined {
  if (isNegativeReview) return { borderLeftColor: CARD_BORDER_COLORS.negative };
  if (isOrderWithCustomization) return { borderLeftColor: CARD_BORDER_COLORS.customization };
  if (!read) return { borderLeftColor: CARD_BORDER_COLORS.unread };
  return undefined;
}

export function parseNotificationContent<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export function isCustomizableOrder(n: Notification): boolean {
  if (n.entityType !== 'order') return false;
  const content = parseNotificationContent<OrderNotificationContent>(n.content);
  return content?.hasCustomization === true;
}

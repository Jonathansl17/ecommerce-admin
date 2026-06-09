export interface Notification {
  id: string;
  adminId: string;
  type: 'internal' | 'email' | 'both';
  title: string;
  content: string | null;
  entityType: string | null;
  entityId: string | null;
  read: boolean;
  sentAt: string | null;
  createdAt: string;
}

export interface OrderNotificationProduct {
  name: string;
  quantity: number;
  unitPrice: number;
  isCustomizable: boolean;
  customizationDetails?: Record<string, string>;
}

export interface OrderNotificationContent {
  orderId: string;
  clientName: string;
  clientEmail?: string;
  products: OrderNotificationProduct[];
  total: number;
  shippingAddress: string;
  hasCustomization: boolean;
  customizationStatus?: 'accepted' | 'rejected';
  customizationRejectionReason?: string;
}

export interface ReviewNotificationContent {
  reviewId?: string;
  productName: string;
  productId: string;
  clientName: string;
  rating: number;
  reviewText: string;
  isPriority: boolean;
}

export interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export type SaveState = 'idle' | 'saving';

export interface ToggleRowProps {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export interface OrderNotificationContentProps {
  content: OrderNotificationContent;
}

export interface ReviewNotificationContentProps {
  content: ReviewNotificationContent;
}

export interface BadgeCountProps {
  count: number;
}

export interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

export interface ToastNotification {
  id: string;
  notification: Notification;
  orderContent: OrderNotificationContent | null;
  reviewContent: ReviewNotificationContent | null;
}

export interface NotificationPreference {
  adminUserId: string;
  receiveOrderNotifications: boolean;
  receiveReviewNotifications: boolean;
}

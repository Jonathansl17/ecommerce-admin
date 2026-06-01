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
  reviewId: string;
  productName: string;
  productId: string;
  clientName: string;
  rating: number;
  reviewText: string;
  isPriority: boolean;
}

export interface NotificationPreference {
  adminUserId: string;
  receiveOrderNotifications: boolean;
  receiveReviewNotifications: boolean;
}

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
}

export interface OrderNotificationContent {
  orderId: string;
  clientName: string;
  products: OrderNotificationProduct[];
  total: number;
  shippingAddress: string;
  hasCustomization: boolean;
}

export interface NotificationPreference {
  adminUserId: string;
  receiveOrderNotifications: boolean;
}

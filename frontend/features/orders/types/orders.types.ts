export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_preparation'
  | 'customization_in_progress'
  | 'ready_shipment'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface AdminOrderClientUser {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminOrderVariantProduct {
  itemId: string;
  imageUrl: string | null;
  item: {
    name: string;
  };
}

export interface AdminOrderVariant {
  id: string;
  color: string | null;
  size: string | null;
  product: AdminOrderVariantProduct;
}

export interface AdminOrderItem {
  id: string;
  quantity: number;
  unitPriceSnap: number;
  variant: AdminOrderVariant;
}

export interface AdminOrderPayment {
  id: string;
  method: string;
  externalReference: string | null;
  amount: number;
  status: string;
  createdAt: string;
}

export interface AdminOrderStatusNotification {
  id: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  status: OrderStatus;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  clientUser: AdminOrderClientUser | undefined;
  orderItems: AdminOrderItem[];
  payments: AdminOrderPayment[];
  orderStatusNotifications: AdminOrderStatusNotification[];
}

export interface AdminOrdersListResponse {
  total: number;
  items: AdminOrder[];
}

export interface OrderFilters {
  status?: OrderStatus;
  clientUserId?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

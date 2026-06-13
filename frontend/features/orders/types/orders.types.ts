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
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedAt: string;
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

export interface FetchOptions {
  signal?: AbortSignal;
}

export interface UseOrderMutationsReturn {
  ejecutando: boolean;
  error: string | null;
  actualizarEstado: (id: string, status: OrderStatus) => Promise<AdminOrder | null>;
  cancelar: (id: string) => Promise<AdminOrder | null>;
  aprobarPago: (id: string, paymentId: string) => Promise<boolean>;
}

export interface ApprovePaymentButtonProps {
  currentStatus: OrderStatus;
  paymentStatus: string;
  disabled: boolean;
  onApprove: () => void;
}

export interface ConfirmApproveDialogProps {
  disabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface OrderDetailErrorProps {
  error: string | null;
}

export interface OrderDetailHeaderProps {
  pedido: AdminOrder;
  ejecutando: boolean;
  mutationError: string | null;
  onStatusChange: (status: OrderStatus) => void;
  onCancel: () => void;
  onApprovePayment: () => void;
}

export interface OrderClientInfoProps {
  clientUser: AdminOrderClientUser | undefined;
}

export interface OrderShippingAddressProps {
  address: string;
}

export interface OrderItemsSectionProps {
  items: AdminOrderItem[];
}

export interface OrderPaymentsSectionProps {
  payments: AdminOrderPayment[];
}

export interface OrderStatusTimelineProps {
  notifications: AdminOrderStatusNotification[];
}

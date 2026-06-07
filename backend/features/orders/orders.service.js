import prisma from '../../shared/db/prisma.js';
import { broadcast } from '../../shared/sse/sseManager.js';
import { createOrderNotification as persistOrderNotifications } from '../notifications/notifications.factory.service.js';
import { NOTIFICATION_EVENTS } from '../notifications/notifications.constants.js';
import {
  listOrders as listOrdersClient,
  getOrder as getOrderClient,
  updateOrderStatus as updateOrderStatusClient,
  cancelOrder as cancelOrderClient,
} from '../../shared/clientApi/orders.client.js';
import { ClientApiError } from '../../shared/clientApi/client-api.errors.js';
import { CLIENT_API_ERROR_CODES } from '../../shared/clientApi/client-api.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { ORDER_BAD_RESPONSE_FIELDS, ORDER_MESSAGES } from './orders.constants.js';
import { ACCOUNT_STATUS } from '../../shared/constants/app.constants.js';

/**
 * Create notifications for all admins that have order notifications enabled
 * (or have no preference row yet, which defaults to true).
 * Broadcasts an SSE event to every notified admin's open connections.
 *
 * @param {{ orderId: string, clientName: string, products: object[], total: number, shippingAddress: string, hasCustomization: boolean }} orderData
 * @returns {{ notifiedCount: number }}
 */
export const createOrderNotification = async (orderData) => {
  const adminUsers = await prisma.adminUser.findMany({
    where: {
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      admin: { isNot: null },
      OR: [
        { notificationPreference: { receiveOrderNotifications: true } },
        { notificationPreference: null },
      ],
    },
    select: { id: true },
  });

  if (adminUsers.length === 0) {
    return { notifiedCount: 0 };
  }

  const targetAdminIds = adminUsers.map((u) => u.id);

  const notifications = await persistOrderNotifications(orderData, targetAdminIds);

  for (let i = 0; i < targetAdminIds.length; i++) {
    const adminId = String(targetAdminIds[i]);
    const notification = notifications[i];
    broadcast([adminId], NOTIFICATION_EVENTS.NEW_ORDER, { notification });
  }

  return { notifiedCount: notifications.length };
};

const extractBadResponseMessage = (body, fallback) => {
  if (body && typeof body === 'object' && typeof body[ORDER_BAD_RESPONSE_FIELDS.ERROR] === 'string') {
    return body[ORDER_BAD_RESPONSE_FIELDS.ERROR];
  }
  return fallback;
};

/**
 * Maps a ClientApiError raised by the client backend wrapper into an HTTP error
 * suitable for the admin error handler. Non-ClientApiError errors are re-thrown
 * untouched so they bubble up as 500s through the default handler.
 */
const SAFE_STATUS_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: 'La solicitud al servicio del cliente es inválida',
  [HTTP_STATUS.NOT_FOUND]: ORDER_MESSAGES.NO_ENCONTRADO,
  [HTTP_STATUS.CONFLICT]: 'Conflicto con el estado actual del pedido',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'El pedido no puede procesarse en este momento',
};

const mapClientApiError = (error, { notFoundMessage } = {}) => {
  if (!(error instanceof ClientApiError)) return error;

  if (error.code === CLIENT_API_ERROR_CODES.BAD_RESPONSE) {
    const status = error.status ?? HTTP_STATUS.INTERNAL_ERROR;
    if (status === HTTP_STATUS.NOT_FOUND) {
      return crearError(
        notFoundMessage ?? ORDER_MESSAGES.NO_ENCONTRADO,
        HTTP_STATUS.NOT_FOUND,
      );
    }
    const safeMessage = SAFE_STATUS_MESSAGES[status] ?? ORDER_MESSAGES.ERROR_DESCONOCIDO;
    return crearError(safeMessage, status);
  }

  if (
    error.code === CLIENT_API_ERROR_CODES.UNREACHABLE ||
    error.code === CLIENT_API_ERROR_CODES.TIMEOUT
  ) {
    return crearError(ORDER_MESSAGES.SERVICIO_EXTERNO_NO_DISPONIBLE, HTTP_STATUS.BAD_GATEWAY);
  }

  if (error.code === CLIENT_API_ERROR_CODES.MISSING_CONFIG) {
    return crearError(ORDER_MESSAGES.CONFIGURACION_CLIENTE_FALTANTE, HTTP_STATUS.INTERNAL_ERROR);
  }

  return crearError(ORDER_MESSAGES.ERROR_DESCONOCIDO, HTTP_STATUS.INTERNAL_ERROR);
};

export const listarPedidos = async (filtros) => {
  try {
    return await listOrdersClient(filtros);
  } catch (error) {
    throw mapClientApiError(error);
  }
};

export const obtenerPedidoPorId = async (id) => {
  try {
    return await getOrderClient(id);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: ORDER_MESSAGES.NO_ENCONTRADO });
  }
};

function unwrapOrder(response) {
  if (response != null && typeof response === 'object' && 'order' in response) {
    return response.order;
  }
  return response;
}

export const actualizarEstadoPedido = async (id, status) => {
  try {
    const response = await updateOrderStatusClient(id, { status });
    return unwrapOrder(response);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: ORDER_MESSAGES.NO_ENCONTRADO });
  }
};

export const cancelarPedido = async (id) => {
  try {
    const response = await cancelOrderClient(id);
    return unwrapOrder(response);
  } catch (error) {
    throw mapClientApiError(error, { notFoundMessage: ORDER_MESSAGES.NO_ENCONTRADO });
  }
};

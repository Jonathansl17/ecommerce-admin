import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { CUSTOM_ORDERS_MESSAGES } from './custom-orders.constants.js';

const SOLD_STATUS = 'sold';
const DEFAULT_QUANTITY = 1;

const serializeCustomOrder = (order, product) => ({
  id: order.id.toString(),
  clientId: order.clientId.toString(),
  productId: order.productId.toString(),
  adminId: order.adminId.toString(),
  customizationDetails: order.customizationDetails,
  status: order.status,
  rejectionReason: order.rejectionReason ?? null,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  product: product
    ? { id: product.id.toString(), name: product.name, currentStock: product.currentStock }
    : null,
});

export const listarPedidosPersonalizados = async () => {
  const orders = await prisma.customOrder.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (orders.length === 0) return [];

  const productIds = [...new Set(orders.map((o) => o.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, currentStock: true },
  });
  const productMap = new Map(products.map((p) => [p.id.toString(), p]));

  return orders.map((order) => serializeCustomOrder(order, productMap.get(order.productId.toString()) ?? null));
};

export const actualizarEstado = async (id, nuevoEstado, adminId) => {
  const bigId = BigInt(id);

  const order = await prisma.customOrder.findUnique({ where: { id: bigId } });
  if (!order) throw crearError(CUSTOM_ORDERS_MESSAGES.NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

  if (nuevoEstado === SOLD_STATUS) {
    const product = await prisma.product.findUnique({ where: { id: order.productId } });
    if (!product) throw crearError(CUSTOM_ORDERS_MESSAGES.PRODUCTO_NO_ENCONTRADO, HTTP_STATUS.NOT_FOUND);

    const quantity =
      typeof order.customizationDetails?.quantity === 'number'
        ? order.customizationDetails.quantity
        : DEFAULT_QUANTITY;

    if (product.currentStock < quantity) {
      throw crearError(CUSTOM_ORDERS_MESSAGES.STOCK_INSUFICIENTE, HTTP_STATUS.CONFLICT);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const previousQuantity = product.currentStock;
      const newQuantity = previousQuantity - quantity;

      await tx.productStockMovement.create({
        data: {
          productId: order.productId,
          adminId: BigInt(adminId),
          type: 'sale',
          previousQuantity,
          newQuantity,
        },
      });

      await tx.product.update({
        where: { id: order.productId },
        data: { currentStock: newQuantity },
      });

      return tx.customOrder.update({
        where: { id: bigId },
        data: { status: nuevoEstado },
      });
    });

    const product2 = await prisma.product.findUnique({
      where: { id: updatedOrder.productId },
      select: { id: true, name: true, currentStock: true },
    });
    return serializeCustomOrder(updatedOrder, product2);
  }

  const updatedOrder = await prisma.customOrder.update({
    where: { id: bigId },
    data: { status: nuevoEstado },
  });

  const product = await prisma.product.findUnique({
    where: { id: updatedOrder.productId },
    select: { id: true, name: true, currentStock: true },
  });
  return serializeCustomOrder(updatedOrder, product);
};

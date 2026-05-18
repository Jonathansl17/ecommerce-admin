import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  createOrderNotification as createOrderNotificationService,
  listarPedidos as listarPedidosService,
  obtenerPedidoPorId as obtenerPedidoPorIdService,
  actualizarEstadoPedido as actualizarEstadoPedidoService,
  cancelarPedido as cancelarPedidoService,
} from './orders.service.js';

export const notifyNewOrder = async (req, res, next) => {
  try {
    const result = await createOrderNotificationService(req.body);
    return res.status(HTTP_STATUS.OK).json({ data: result, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const listar = async (req, res, next) => {
  try {
    const result = await listarPedidosService(req.validatedQuery);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const order = await obtenerPedidoPorIdService(req.params.id);
    return res.status(HTTP_STATUS.OK).json(order);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const order = await actualizarEstadoPedidoService(req.params.id, req.body.status);
    return res.status(HTTP_STATUS.OK).json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelar = async (req, res, next) => {
  try {
    const order = await cancelarPedidoService(req.params.id);
    return res.status(HTTP_STATUS.OK).json(order);
  } catch (error) {
    next(error);
  }
};

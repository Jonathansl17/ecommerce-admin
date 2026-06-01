import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import {
  listarPedidosPersonalizados,
  actualizarEstado as actualizarEstadoService,
} from './custom-orders.service.js';

export const listar = async (req, res, next) => {
  try {
    const orders = await listarPedidosPersonalizados();
    return res.status(HTTP_STATUS.OK).json(orders);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const order = await actualizarEstadoService(req.params.id, req.body.status, req.user.id);
    return res.status(HTTP_STATUS.OK).json(order);
  } catch (error) {
    next(error);
  }
};

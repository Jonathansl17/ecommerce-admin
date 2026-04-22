import {
  getAll as getAllService,
  getById as getByIdService,
  create as createService,
  update as updateService,
  remove as removeService,
  adjustSupplyStock as adjustSupplyStockService,
  getSupplyMovements as getSupplyMovementsService,
} from './products.service.js';
import { PRODUCTS_MESSAGES } from './products.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const productos = await getAllService();
    return res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const producto = await getByIdService(req.params.id);
    return res.status(HTTP_STATUS.OK).json(producto);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const producto = await createService(req.body);
    return res.status(HTTP_STATUS.CREATED).json(producto);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const producto = await updateService(req.params.id, req.body);
    return res.status(HTTP_STATUS.OK).json(producto);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const producto = await removeService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({
      message: PRODUCTS_MESSAGES.ELIMINADO_EXITOSO,
      producto,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const supply = await adjustSupplyStockService(req.params.id, req.body, req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: supply, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getMovements = async (req, res, next) => {
  try {
    const result = await getSupplyMovementsService(req.params.id, req.query);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

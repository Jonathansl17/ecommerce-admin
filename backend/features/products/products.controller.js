import {
  getAll as getAllService,
  getById as getByIdService,
  create as createService,
  update as updateService,
  remove as removeService,
  adjustVariantStock as adjustVariantStockService,
  getVariantMovements as getVariantMovementsService,
  bulkAdjustVariantStock as bulkAdjustVariantStockService,
} from './products.service.js';
import { PRODUCTS_MESSAGES } from './products.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const products = await getAllService();
    return res.status(HTTP_STATUS.OK).json(products);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const product = await getByIdService(req.params.id);
    return res.status(HTTP_STATUS.OK).json(product);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await createService(req.body);
    return res.status(HTTP_STATUS.CREATED).json(product);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await updateService(req.params.id, req.body);
    return res.status(HTTP_STATUS.OK).json(product);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const product = await removeService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({
      message: PRODUCTS_MESSAGES.ELIMINADO_EXITOSO,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustVariantStock = async (req, res, next) => {
  try {
    const variant = await adjustVariantStockService(req.params.variantId, req.body, req.user.id);
    return res.status(HTTP_STATUS.OK).json({ data: variant, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getVariantMovements = async (req, res, next) => {
  try {
    const result = await getVariantMovementsService(req.params.variantId, req.query);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const bulkAdjustVariantStock = async (req, res, next) => {
  try {
    const { adjustments, reason, note } = req.body;
    const result = await bulkAdjustVariantStockService(adjustments, reason, note, req.user.id);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

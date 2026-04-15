import { getAll as getAllService, create as createService, update as updateService, createEntry as createEntryService } from './inventory.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const insumos = await getAllService();
    return res.status(HTTP_STATUS.OK).json({ data: insumos, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const insumo = await createService(req.body);
    return res.status(HTTP_STATUS.CREATED).json({ data: insumo, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const insumo = await updateService(req.params.id, req.body);
    return res.status(HTTP_STATUS.OK).json({ data: insumo, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const createEntry = async (req, res, next) => {
  try {
    const insumo = await createEntryService(req.params.id, req.body, req.user.id);
    return res.status(HTTP_STATUS.CREATED).json({ data: insumo, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

import {
  getAll as getAllService,
  getById as getByIdService,
  create as createService,
  update as updateService,
  remove as removeService,
} from './clients.service.js';
import { CLIENTS_MESSAGES } from './clients.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const adminUsers = await getAllService();
    return res.status(HTTP_STATUS.OK).json(adminUsers);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const adminUser = await getByIdService(req.params.id);
    return res.status(HTTP_STATUS.OK).json(adminUser);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const adminUser = await createService(req.body);
    return res.status(HTTP_STATUS.CREATED).json(adminUser);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const adminUser = await updateService(req.params.id, req.body);
    return res.status(HTTP_STATUS.OK).json(adminUser);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const adminUser = await removeService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({
      message: CLIENTS_MESSAGES.ELIMINADO_EXITOSO,
      adminUser,
    });
  } catch (error) {
    next(error);
  }
};

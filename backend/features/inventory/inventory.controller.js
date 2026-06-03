import { getAll as getAllService, create as createService, update as updateService, remove as removeService } from './inventory.supply.service.js';
import { createEntry as createEntryService, createEntries as createEntriesService, createConsumption as createConsumptionService } from './inventory.movement.service.js';
import { getMovements as getMovementsService, getReport as getReportService } from './inventory.report.service.js';
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

export const deleteSupply = async (req, res, next) => {
  try {
    const insumo = await removeService(req.params.id);
    return res.status(HTTP_STATUS.OK).json({ data: insumo, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const data = await getReportService(dateFrom, dateTo);
    return res.status(HTTP_STATUS.OK).json({ data, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const getMovements = async (req, res, next) => {
  try {
    const { type, dateFrom, dateTo, page, limit } = req.query;
    const { meta, ...data } = await getMovementsService(req.params.id, { type, dateFrom, dateTo, page, limit });
    return res.status(HTTP_STATUS.OK).json({ data, error: null, meta });
  } catch (error) {
    next(error);
  }
};

export const createEntries = async (req, res, next) => {
  try {
    const { items, date } = req.body;
    const data = await createEntriesService(items, { date }, req.user.id);
    return res.status(HTTP_STATUS.CREATED).json({ data, error: null, meta: null });
  } catch (error) {
    next(error);
  }
};

export const createConsumption = async (req, res, next) => {
  try {
    const { items, reference, date } = req.body;
    const insumos = await createConsumptionService(items, { reference, date }, req.user.id);
    return res.status(HTTP_STATUS.CREATED).json({ data: insumos, error: null, meta: null });
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

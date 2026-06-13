import { getStoreUsers, changeStoreUserStatus } from './store-users.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { CLIENTS_CONFIG } from './clients.constants.js';

const clampLimit = (raw) => {
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return CLIENTS_CONFIG.DEFAULT_PAGE_SIZE;
  return Math.min(Math.max(1, parsed), CLIENTS_CONFIG.MAX_PAGE_SIZE);
};

const clampOffset = (raw) => {
  const parsed = parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
};

export const getAll = async (req, res, next) => {
  try {
    const { search, field, status, sortBy, sortOrder } = req.query;
    const limit = clampLimit(req.query.limit);
    const offset = clampOffset(req.query.offset);
    const result = await getStoreUsers({ search, field, status, limit, offset, sortBy, sortOrder });
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const { accountStatus } = req.body;
    const user = await changeStoreUserStatus(req.params.id, accountStatus);
    return res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    next(error);
  }
};

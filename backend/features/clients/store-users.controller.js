import { getStoreUsers, changeStoreUserStatus } from './store-users.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const { search, field, sortBy, sortOrder } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    console.log('[store-users] query params:', { search, field, sortBy, sortOrder, limit, offset });
    const result = await getStoreUsers({ search, field, limit, offset, sortBy, sortOrder });
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

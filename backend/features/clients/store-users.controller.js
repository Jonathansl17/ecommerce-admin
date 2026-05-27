import { getStoreUsers, changeStoreUserStatus } from './store-users.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const users = await getStoreUsers({ search });
    return res.status(HTTP_STATUS.OK).json(users);
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

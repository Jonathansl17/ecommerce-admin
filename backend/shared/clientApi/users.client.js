import { HTTP_METHODS } from './client-api.constants.js';
import { clientApiFetch } from './client-api.fetch.js';

const USERS_PATH = '/users';

export const listClients = ({ email, limit, offset, signal } = {}) =>
  clientApiFetch(USERS_PATH, {
    method: HTTP_METHODS.GET,
    query: { email, limit, offset },
    signal,
  });

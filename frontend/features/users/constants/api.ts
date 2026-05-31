export const USERS_PAGE_SIZE = 30;

export const USERS_API = {
  GET_ALL: (params: {
    search?: string;
    field?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const { search, field, limit, offset, sortBy, sortOrder } = params;
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (field) query.set('field', field);
    if (limit !== undefined) query.set('limit', String(limit));
    if (offset !== undefined) query.set('offset', String(offset));
    if (sortBy) query.set('sortBy', sortBy);
    if (sortOrder) query.set('sortOrder', sortOrder);
    const qs = query.toString();
    return qs ? `/store-users?${qs}` : '/store-users';
  },
  CHANGE_STATUS: (id: string) => `/store-users/${id}/status`,
};

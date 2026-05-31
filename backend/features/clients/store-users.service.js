import clientPool from '../../shared/db/clientPool.js';

const SORT_COLUMNS = {
  fullName: 'full_name',
  createdAt: 'created_at',
  accountStatus: 'account_status',
  email: 'email',
};

export const getStoreUsers = async ({ search, field, limit = 30, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC' } = {}) => {
  const sortColumn = SORT_COLUMNS[sortBy] ?? 'created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const params = [];
  let whereClause = '';

  if (search) {
    params.push(`%${search}%`);
    const filterColumn = field === 'email' ? 'email' : 'full_name';
    whereClause = ` WHERE ${filterColumn} ILIKE $1`;
  }

  const { rows: countRows } = await clientPool.query(
    `SELECT COUNT(*) FROM client_users${whereClause}`,
    params,
  );
  const total = parseInt(countRows[0].count, 10);

  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;

  const { rows: users } = await clientPool.query(
    `SELECT id::text, full_name AS "fullName", email, account_status AS "accountStatus",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM client_users
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...params, limit, offset],
  );

  return { users, total };
};

export const changeStoreUserStatus = async (id, accountStatus) => {
  if (!['active', 'inactive'].includes(accountStatus)) {
    const error = new Error('Estado inválido');
    error.statusCode = 400;
    throw error;
  }

  const { rows } = await clientPool.query(
    `UPDATE client_users
     SET account_status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id::text, full_name AS "fullName", email, account_status AS "accountStatus",
               created_at AS "createdAt", updated_at AS "updatedAt"`,
    [accountStatus, id],
  );

  if (rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
};

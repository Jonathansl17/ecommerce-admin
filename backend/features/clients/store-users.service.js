import clientPool from '../../shared/db/clientPool.js';

const SORT_COLUMNS = {
  fullName: 'full_name',
  createdAt: 'created_at',
  accountStatus: 'account_status',
  email: 'email',
};

export const getStoreUsers = async ({ search, field, status, limit = 30, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC' } = {}) => {
  const sortColumn = SORT_COLUMNS[sortBy] ?? 'created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

  const filterColumn = field === 'email' ? 'email' : 'full_name';
  const pattern = search ? `%${search}%` : null;
  const statusFilter = ['active', 'inactive'].includes(status) ? status : null;

  const whereClause = `($1::text IS NULL OR ${filterColumn} ILIKE $1) AND ($2::text IS NULL OR account_status::text = $2)`;

  const { rows: countRows } = await clientPool.query(
    `SELECT COUNT(*) FROM client_users WHERE ${whereClause}`,
    [pattern, statusFilter],
  );
  const total = parseInt(countRows[0].count, 10);

  const { rows: users } = await clientPool.query(
    `SELECT id::text, full_name AS "fullName", email, account_status AS "accountStatus",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM client_users
     WHERE ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT $3 OFFSET $4`,
    [pattern, statusFilter, limit, offset],
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

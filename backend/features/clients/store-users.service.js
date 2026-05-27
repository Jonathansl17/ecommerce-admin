import clientPool from '../../shared/db/clientPool.js';

export const getStoreUsers = async ({ search } = {}) => {
  let query = `
    SELECT id::text, full_name AS "fullName", email, account_status AS "accountStatus",
           created_at AS "createdAt", updated_at AS "updatedAt"
    FROM client_users
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` WHERE full_name ILIKE $1 OR email ILIKE $1`;
  }

  query += ` ORDER BY created_at DESC`;

  const { rows } = await clientPool.query(query, params);
  return rows;
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

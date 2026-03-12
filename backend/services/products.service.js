const pool = require("../db");

const getAll = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return rows[0];
};

const create = async ({ name, price, description }) => {
  const { rows } = await pool.query(
    "INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *",
    [name, price, description]
  );
  return rows[0];
};

const update = async (id, { name, price, description }) => {
  const { rows } = await pool.query(
    "UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *",
    [name, price, description, id]
  );
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
  return rows[0];
};

module.exports = { getAll, getById, create, update, remove };

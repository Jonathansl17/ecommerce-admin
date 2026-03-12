const prisma = require("../db");

const getAll = async () => {
  return prisma.client.findMany({ include: { products: true } });
};

const getById = async (id) => {
  return prisma.client.findUnique({
    where: { id: Number(id) },
    include: { products: true },
  });
};

const create = async ({ name, email, phone, address }) => {
  return prisma.client.create({
    data: { name, email, phone, address },
  });
};

const update = async (id, data) => {
  return prisma.client.update({
    where: { id: Number(id) },
    data,
  });
};

const remove = async (id) => {
  return prisma.client.delete({
    where: { id: Number(id) },
  });
};

module.exports = { getAll, getById, create, update, remove };

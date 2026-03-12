import prisma from "../db/index.js";

export const getAll = async () => {
  return prisma.product.findMany({ include: { client: true } });
};

export const getById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { client: true },
  });
};

export const create = async ({ name, description, price, stock, clientId }) => {
  return prisma.product.create({
    data: { name, description, price, stock, clientId },
  });
};

export const update = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

export const remove = async (id) => {
  return prisma.product.delete({
    where: { id: Number(id) },
  });
};

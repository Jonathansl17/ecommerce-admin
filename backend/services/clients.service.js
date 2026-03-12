import prisma from "../db/index.js";

export const getAll = async () => {
  return prisma.client.findMany({ include: { products: true } });
};

export const getById = async (id) => {
  return prisma.client.findUnique({
    where: { id: Number(id) },
    include: { products: true },
  });
};

export const create = async ({ name, email, phone, address }) => {
  return prisma.client.create({
    data: { name, email, phone, address },
  });
};

export const update = async (id, data) => {
  return prisma.client.update({
    where: { id: Number(id) },
    data,
  });
};

export const remove = async (id) => {
  return prisma.client.delete({
    where: { id: Number(id) },
  });
};

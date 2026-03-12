import prisma from "../db/prisma.js";
import bcrypt from "bcrypt";

export const getAll = async () => {
  return prisma.client.findMany({ include: { products: true } });
};

export const getById = async (id) => {
  return prisma.client.findUnique({
    where: { id: Number(id) },
    include: { products: true },
  });
};

export const create = async ({ name, email, password, phone, address }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.client.create({
    data: { name, email, password: hashedPassword, phone, address },
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

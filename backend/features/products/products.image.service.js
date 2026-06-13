import prisma from '../../shared/db/prisma.js';
import { PRODUCTS_IMAGE, PRODUCTS_IMAGE_MESSAGES } from './products.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const buildImageUrl = (id) => `${PRODUCTS_IMAGE.PUBLIC_BASE_URL}${PRODUCTS_IMAGE.SERVE_PATH}/${id}`;

export const uploadProductImage = async (buffer, mimeType) => {
  const image = await prisma.productImage.create({
    data: { data: buffer, mimeType },
    select: { id: true },
  });
  return { id: image.id.toString(), url: buildImageUrl(image.id) };
};

export const getProductImage = async (imageId) => {
  const image = await prisma.productImage.findUnique({
    where: { id: BigInt(imageId) },
    select: { data: true, mimeType: true },
  });
  if (!image) throw crearError(PRODUCTS_IMAGE_MESSAGES.NO_ENCONTRADA, HTTP_STATUS.NOT_FOUND);
  return image;
};

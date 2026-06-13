import multer from 'multer';
import { uploadProductImage, getProductImage } from './products.image.service.js';
import { PRODUCTS_IMAGE, PRODUCTS_IMAGE_MESSAGES } from './products.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: PRODUCTS_IMAGE.MAX_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (PRODUCTS_IMAGE.ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error(PRODUCTS_IMAGE_MESSAGES.TIPO_INVALIDO), { status: HTTP_STATUS.BAD_REQUEST }));
  },
});

export const uploadImageMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? PRODUCTS_IMAGE_MESSAGES.DEMASIADO_GRANDE
        : err.message || PRODUCTS_IMAGE_MESSAGES.ERROR_SUBIDA;
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ data: null, error: message, meta: null });
  });
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ data: null, error: PRODUCTS_IMAGE_MESSAGES.ARCHIVO_REQUERIDO, meta: null });
    }
    const result = await uploadProductImage(req.file.buffer, req.file.mimetype);
    return res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const serveImage = async (req, res, next) => {
  try {
    const image = await getProductImage(req.params.imageId);
    res.set('Content-Type', image.mimeType);
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(Buffer.from(image.data));
  } catch (error) {
    next(error);
  }
};

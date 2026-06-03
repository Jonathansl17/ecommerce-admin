import { HTTP_STATUS, HTTP_MESSAGES } from '../constants/http.constants.js';

/**
 * Middleware centralizado de manejo de errores.
 * Captura errores propagados con next(error) y devuelve
 * respuestas consistentes sin exponer detalles internos al cliente.
 */
export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode ?? HTTP_STATUS.INTERNAL_ERROR;
  const message = error.clientMessage ?? HTTP_MESSAGES.INTERNAL_ERROR;

  if (statusCode >= 500) {
    console.error(`[Error] ${req.method} ${req.path}:`, error);
  }

  return res.status(statusCode).json({ error: message });
};

/**
 * Crea un error con un mensaje seguro para el cliente y un código HTTP.
 */
export const crearError = (clientMessage, statusCode) => {
  const error = new Error(clientMessage);
  error.clientMessage = clientMessage;
  error.statusCode = statusCode;
  return error;
};

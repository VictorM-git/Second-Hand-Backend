import { HttpError } from '../utils/HttpError.js';

// Rutas que no existen
export function notFound(req, res) {
  res.status(404).json({ message: `No existe la ruta ${req.method} ${req.originalUrl}` });
}

// Manejador central de errores: todas las respuestas de error tienen la forma { message, errors? }
// eslint-disable-next-line no-unused-vars -- Express reconoce el manejador de errores por sus 4 parámetros
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, ...(err.errors && { errors: err.errors }) });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'La petición es demasiado grande. Usa una imagen más liviana.' });
  }

  console.error(err);
  res.status(500).json({ message: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
}

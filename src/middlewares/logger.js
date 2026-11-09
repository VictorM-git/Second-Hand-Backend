// Middleware básico: muestra en la terminal cada petición con su código de respuesta y duración.
// Ej.: GET /api/items -> 200 (12 ms)
export function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
}

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

// Lee el token del encabezado "Authorization: Bearer <token>"
function readToken(req) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// Devuelve el id del usuario del token, o null si es inválido o expiró
function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret).sub;
  } catch {
    return null;
  }
}

// Ruta protegida: exige un token válido de un usuario activo.
// Se busca el usuario en cada petición para que inactivar una cuenta (RQF009) tenga efecto inmediato.
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) throw new HttpError(401, 'Debes iniciar sesión para continuar.');

  const userId = verifyToken(token);
  const user = userId ? User.findById(userId) : null;
  if (!user) throw new HttpError(401, 'Tu sesión expiró o no es válida. Inicia sesión de nuevo.');
  if (user.status !== 'Activo') throw new HttpError(403, 'Tu cuenta está inactiva. Contacta al administrador.');

  req.user = user;
  next();
}

// Ruta pública que se comporta distinto con sesión (p. ej. para marcar "mine" en los artículos).
// Si no hay token o no es válido, sigue como visitante.
export function optionalAuth(req, res, next) {
  const token = readToken(req);
  const userId = token ? verifyToken(token) : null;
  const user = userId ? User.findById(userId) : null;
  if (user?.status === 'Activo') req.user = user;
  next();
}

// Restringe la ruta a un rol ('user' o 'admin'). Va después de requireAuth.
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      throw new HttpError(403, role === 'admin'
        ? 'Esta acción es solo para el administrador.'
        : 'Esta acción es solo para usuarios de la comunidad.');
    }
    next();
  };
}

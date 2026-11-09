import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { LOCALITIES } from '../constants.js';
import { User } from '../models/User.js';
import { getUserStats } from '../utils/counts.js';
import { HttpError, throwIfErrors } from '../utils/HttpError.js';
import { serializeMe } from '../utils/serializers.js';
import { isEmail, phoneDigits } from '../utils/text.js';

// POST /api/auth/register — RQF001: registrar usuario (el correo debe ser único)
export async function register(req, res) {
  const body = req.body ?? {};
  const data = {
    name: String(body.name ?? '').trim(),
    email: String(body.email ?? '').trim().toLowerCase(),
    phone: String(body.phone ?? '').trim(),
    location: String(body.location ?? ''),
    password: String(body.password ?? ''),
  };

  throwIfErrors({
    name: data.name ? '' : 'Este campo es obligatorio.',
    email: isEmail(data.email) ? '' : 'Ingresa un correo válido.',
    phone: phoneDigits(data.phone).length === 10 ? '' : 'El teléfono debe tener 10 dígitos.',
    location: LOCALITIES.includes(data.location) ? '' : 'Selecciona tu localidad.',
    password: data.password.length >= 8 ? '' : 'Mínimo 8 caracteres.',
    confirmPassword: body.confirmPassword === undefined || body.confirmPassword === data.password
      ? '' : 'Las contraseñas no coinciden.',
  });

  if (User.findByEmail(data.email)) {
    throw new HttpError(409, 'Este correo ya está registrado.');
  }

  const user = await User.create(data); // el modelo guarda el hash de la contraseña
  res.status(201).json({ user: serializeMe(user, { publications: 0, requests: 0 }) });
}

// POST /api/auth/login — RQF002: iniciar sesión. Devuelve { user, token } (JWT).
export async function login(req, res) {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  throwIfErrors({
    email: isEmail(email) ? '' : 'Ingresa un correo válido.',
    password: password ? '' : 'Ingresa tu contraseña.',
  });

  const user = User.findByEmail(email);
  if (!user || !(await User.checkPassword(user, password))) {
    throw new HttpError(401, 'Correo o contraseña incorrectos.');
  }
  // RQF009: las cuentas inactivadas por el administrador no pueden entrar
  if (user.status !== 'Activo') {
    throw new HttpError(403, 'Tu cuenta está inactiva. Contacta al administrador.');
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ user: serializeMe(user, getUserStats(user.id)), token });
}

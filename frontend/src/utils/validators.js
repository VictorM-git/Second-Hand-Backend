// Validadores reutilizables. Cada uno devuelve un mensaje de error o '' si el valor es válido.

export const required = (value) =>
  String(value ?? '').trim() ? '' : 'Este campo es obligatorio.';

export const validateEmail = (value) => {
  if (!String(value).trim()) return 'Ingresa tu correo electrónico.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Ingresa un correo válido.';
};

export const validatePassword = (value) => {
  if (!value) return 'Ingresa tu contraseña.';
  return value.length >= 8 ? '' : 'Mínimo 8 caracteres.';
};

export const validatePhone = (value) => {
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return 'Ingresa tu teléfono de contacto.';
  return digits.length === 10 ? '' : 'El teléfono debe tener 10 dígitos.';
};

export const validateMatch = (value, other) =>
  value === other ? '' : 'Las contraseñas no coinciden.';

import { fileURLToPath } from 'node:url';

// Variables de entorno. En local se leen de backend/.env (ver .env.example);
// en la nube (Render, Railway…) se configuran en el panel del servicio.
try {
  process.loadEnvFile(fileURLToPath(new URL('../../.env', import.meta.url)));
} catch {
  // Sin archivo .env: se usan las variables que ya existan en el sistema
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Copia .env.example como .env y complétala.`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  // Orígenes que pueden llamar a la API desde el navegador (separados por coma)
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()),
  // Contraseñas de las cuentas de prueba que se cargan al iniciar
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin12345',
  seedUserPassword: process.env.SEED_USER_PASSWORD || 'Usuario12345',
};

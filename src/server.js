import app from './app.js';
import { env } from './config/env.js';
import { loadSeedData } from './data/seed.js';

// Punto de entrada. Por ahora no hay base de datos: los datos viven en memoria.
// Al arrancar se cargan los datos de prueba y luego se abre el puerto.
const loaded = await loadSeedData({ adminPassword: env.seedAdminPassword, userPassword: env.seedUserPassword });
console.log(`Datos de prueba en memoria: ${loaded.users} usuarios, ${loaded.categories} categorías, `
  + `${loaded.items} artículos, ${loaded.requests} solicitudes`);

app.listen(env.port, (error) => {
  // Express 5 entrega aquí los errores al abrir el puerto (p. ej. puerto ocupado)
  if (error) {
    console.error(`No se pudo abrir el puerto ${env.port}:`, error.message);
    process.exit(1);
  }
  console.log(`API escuchando en http://localhost:${env.port}/api`);
  console.log(`Documentación Swagger en http://localhost:${env.port}/api/docs`);
  console.log('Cuentas de prueba: ana@correo.com / admin@secondhand.com (ver README)');
});

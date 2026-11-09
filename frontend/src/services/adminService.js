import { loadUsers } from './usersService.js';
import { loadCategories } from './categoriesService.js';

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Indicadores del panel de moderación (RQF011).
// Usuarios y categorías activas salen de los datos guardados; artículos y solicitudes son valores de ejemplo
// hasta tener el backend. Futuro: GET `${API_URL}/admin/stats`.
export async function getDashboardStats() {
  await wait();
  return {
    activeUsers: loadUsers().filter((u) => u.status === 'Activo').length,
    publishedItems: 1024,
    requestsThisWeek: 63,
    activeCategories: loadCategories().filter((c) => c.status === 'Activa').length,
  };
}

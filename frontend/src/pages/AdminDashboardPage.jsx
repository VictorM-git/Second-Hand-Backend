import { Link } from 'react-router-dom';
import StatCard from '../components/admin/StatCard.jsx';
import Chip from '../components/Chip.jsx';
import useAsync from '../hooks/useAsync.js';
import { getDashboardStats } from '../services/adminService.js';
import { getRecentUsers } from '../services/usersService.js';
import { formatShortDate } from '../utils/format.js';

const number = new Intl.NumberFormat('es-CO'); // 1024 -> "1.024"

// RQF011 - Dashboard del administrador: indicadores y últimos registros.
export default function AdminDashboardPage() {
  const { data: stats, error: statsError } = useAsync(getDashboardStats);
  const { data: recent, loading, error } = useAsync(() => getRecentUsers(7));

  return (
    <div className="page container-xl">
      <div className="page__head">
        <h1>Panel de moderación</h1>
        <p>Estado general de la plataforma.</p>
      </div>

      {statsError && <p role="alert" className="text-danger">{statsError}</p>}
      <div className="stats">
        <StatCard label="Usuarios activos" value={stats ? number.format(stats.activeUsers) : '—'} />
        <StatCard label="Artículos publicados" value={stats ? number.format(stats.publishedItems) : '—'} />
        <StatCard label="Solicitudes esta semana" value={stats ? number.format(stats.requestsThisWeek) : '—'} />
        <StatCard label="Categorías activas" value={stats ? number.format(stats.activeCategories) : '—'} />
      </div>

      <div className="section-head">
        <h2>Últimos registros</h2>
        <Link to="/admin/usuarios" className="btn btn-sh-outline btn-sm">Ver todos los usuarios</Link>
      </div>

      {loading && <p role="status">Cargando…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}

      {recent && (
        <div className="admin-card">
          <table className="admin-table admin-table--recent">
            <thead>
              <tr><th>Usuario</th><th>Correo</th><th>Ubicación</th><th>Registro</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {recent.map((u) => (
                <tr key={u.id}>
                  <td className="c-name">{u.name}</td>
                  <td className="c-email">{u.email}</td>
                  <td className="c-loc">{u.location}</td>
                  <td className="c-date">{formatShortDate(u.registeredAt)}</td>
                  <td className="c-state"><Chip variant={u.status === 'Activo' ? 'green' : 'grey'}>{u.status}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

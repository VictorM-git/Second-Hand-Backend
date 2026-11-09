import { useMemo, useState } from 'react';
import Chip from '../components/Chip.jsx';
import useUsersAdmin from '../hooks/useUsersAdmin.js';
import { normalize } from '../utils/format.js';

// RQF009 - Gestionar usuarios: consultar, inactivar y reactivar cuentas.
export default function AdminUsersPage() {
  const { users, loading, error, busyId, toggleStatus } = useUsersAdmin();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('todos');

  const filtered = useMemo(() => {
    const term = normalize(q.trim());
    return users.filter((u) =>
      (!term || normalize(`${u.name} ${u.email}`).includes(term)) &&
      (status === 'todos' || u.status === status)
    );
  }, [users, q, status]);

  return (
    <div className="page container-xl">
      <div className="page__head">
        <h1>Usuarios</h1>
        <p>Inactiva las cuentas que incumplen las normas de la comunidad.</p>
      </div>

      <div className="admin-toolbar">
        <input type="search" className="filters__control admin-toolbar__search" placeholder="Buscar por nombre o correo"
               aria-label="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="filters__control admin-toolbar__select" aria-label="Filtrar por estado"
                value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>
        <span className="admin-toolbar__count" role="status">Mostrando {filtered.length} de {users.length}</span>
      </div>

      {loading && <p role="status">Cargando usuarios…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <div className="explore__empty"><p>No encontramos usuarios con esos criterios.</p></div>
      )}

      {filtered.length > 0 && (
        <div className="admin-card">
          <table className="admin-table admin-table--users">
            <thead>
              <tr>
                <th>Usuario</th><th>Correo</th><th>Ubicación</th><th>Publicaciones</th><th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="c-name">{u.name}</td>
                  <td className="c-email">{u.email}</td>
                  <td className="c-loc">{u.location}</td>
                  <td className="c-count">{u.publications}</td>
                  <td className="c-state"><Chip variant={u.status === 'Activo' ? 'green' : 'grey'}>{u.status}</Chip></td>
                  <td className="c-actions">
                    {u.status === 'Activo' ? (
                      <button type="button" className="btn btn-sh-outline btn-sm" disabled={busyId === u.id}
                              onClick={() => toggleStatus(u)}>Inactivar</button>
                    ) : (
                      <button type="button" className="btn btn-sh btn-sm" disabled={busyId === u.id}
                              onClick={() => toggleStatus(u)}>Reactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

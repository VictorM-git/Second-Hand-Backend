import { useEffect, useState } from 'react';
import { getUsers, setUserStatus } from '../services/usersService.js';

// Lista de usuarios para el administrador, con inactivar/reactivar (RQF009).
export default function useUsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;
    getUsers()
      .then((data) => active && setUsers(data))
      .catch(() => active && setError('No pudimos cargar los usuarios.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const toggleStatus = async (user) => {
    setBusyId(user.id);
    setError(null);
    try {
      const next = user.status === 'Activo' ? 'Inactivo' : 'Activo';
      const updated = await setUserStatus(user.id, next);
      setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return { users, loading, error, busyId, toggleStatus };
}

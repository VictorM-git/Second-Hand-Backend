import { useEffect, useState } from 'react';
import { deleteReceivedRequest, getReceivedRequests, respondToRequest } from '../services/receivedRequestsService.js';

// Solicitudes recibidas sobre mis publicaciones: aceptar, rechazar, deshacer y eliminar (RQF006).
export default function useReceivedRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;
    getReceivedRequests()
      .then((data) => active && setItems(data))
      .catch(() => active && setError('No pudimos cargar las solicitudes.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Ejecuta una acción sobre una solicitud y muestra el error si la regla de negocio la rechaza
  const run = async (id, action) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const respond = (id, status) => run(id, async () => {
    const updated = await respondToRequest(id, status);
    setItems((list) => list.map((r) => (r.id === id ? updated : r)));
  });

  const remove = (id) => run(id, async () => {
    await deleteReceivedRequest(id);
    setItems((list) => list.filter((r) => r.id !== id));
  });

  return { items, loading, error, busyId, respond, remove };
}

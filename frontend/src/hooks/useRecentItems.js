import { useEffect, useState } from 'react';
import { getRecentItems } from '../services/itemsService.js';

// Hook que carga los artículos recientes y maneja estados de carga y error.
export default function useRecentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true; // evita actualizar estado si el componente se desmontó
    getRecentItems()
      .then((data) => active && setItems(data))
      .catch(() => active && setError('No pudimos cargar los artículos. Intenta de nuevo.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return { items, loading, error };
}

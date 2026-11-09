import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalize } from '../utils/format.js';

export const PAGE_SIZE = 8;
const INITIAL_FILTERS = { category: 'Todos', conditions: [], location: '' };

/**
 * RQF005 - Buscar y filtrar artículos.
 * La palabra clave vive en la URL (?q=) para que el buscador del navbar y el del panel compartan valor.
 * Categoría, estado, ubicación, orden y página viven en estado local.
 */
export default function useItemsFilter(items = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);

  // Al cambiar cualquier criterio se vuelve a la primera página
  useEffect(() => { setPage(1); }, [q, filters, sort]);

  const filtered = useMemo(() => {
    const term = normalize(q.trim());
    const result = items.filter((item) =>
      (!term || normalize(`${item.title} ${item.description.join(' ')}`).includes(term)) &&
      (filters.category === 'Todos' || item.category === filters.category) &&
      (filters.conditions.length === 0 || filters.conditions.includes(item.condition)) &&
      (!filters.location || item.location === filters.location)
    );
    const sorters = {
      recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      title: (a, b) => a.title.localeCompare(b.title, 'es'),
    };
    return [...result].sort(sorters[sort]);
  }, [items, q, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    q,
    setQ: (value) => setSearchParams(value ? { q: value } : {}, { replace: true }),
    filters,
    setCategory: (category) => setFilters((f) => ({ ...f, category })),
    toggleCondition: (c) => setFilters((f) => ({
      ...f,
      conditions: f.conditions.includes(c) ? f.conditions.filter((x) => x !== c) : [...f.conditions, c],
    })),
    setLocation: (location) => setFilters((f) => ({ ...f, location })),
    clearFilters: () => { setFilters(INITIAL_FILTERS); setSearchParams({}, { replace: true }); },
    sort, setSort,
    page,
    setPage: (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    totalPages,
    total: filtered.length,
    pageItems,
  };
}

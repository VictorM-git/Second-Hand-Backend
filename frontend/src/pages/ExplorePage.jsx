import FilterPanel from '../components/explore/FilterPanel.jsx';
import Pagination from '../components/explore/Pagination.jsx';
import ItemCard from '../components/ItemCard.jsx';
import useAsync from '../hooks/useAsync.js';
import useItemsFilter, { PAGE_SIZE } from '../hooks/useItemsFilter.js';
import { getItems } from '../services/itemsService.js';

// Dashboard principal (RQF011) con búsqueda y filtros (RQF005).
export default function ExplorePage() {
  const { data: items, loading, error } = useAsync(getItems);
  const f = useItemsFilter(items ?? []);

  const from = f.total === 0 ? 0 : (f.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(f.page * PAGE_SIZE, f.total);

  return (
    <div className="explore container-xl">
      <div className="explore__head">
        <h1>Explorar</h1>
        <p>{items ? items.length : 0} artículos disponibles en tu comunidad.</p>
      </div>

      <div className="explore__layout">
        <aside>
          <FilterPanel q={f.q} onQ={f.setQ} filters={f.filters} onCategory={f.setCategory}
                       onToggleCondition={f.toggleCondition} onLocation={f.setLocation} onClear={f.clearFilters} />
        </aside>

        <section aria-label="Resultados">
          <div className="explore__toolbar">
            <span role="status">Mostrando {from}–{to} de {f.total}</span>
            <label className="explore__sort">
              Ordenar por:
              <select value={f.sort} onChange={(e) => f.setSort(e.target.value)}>
                <option value="recent">Más recientes primero</option>
                <option value="oldest">Más antiguos primero</option>
                <option value="title">Título (A-Z)</option>
              </select>
            </label>
          </div>

          {loading && <p role="status">Cargando artículos…</p>}
          {error && <p role="alert" className="text-danger">{error}</p>}

          {!loading && !error && f.total === 0 && (
            <div className="explore__empty">
              <p>No encontramos artículos con esos filtros. Prueba quitando alguno.</p>
              <button type="button" className="btn btn-sh btn-sm" onClick={f.clearFilters}>Limpiar filtros</button>
            </div>
          )}

          <div className="explore__grid">
            {f.pageItems.map((item) => <ItemCard key={item.id} item={item} to={`/articulos/${item.id}`} />)}
          </div>

          <Pagination page={f.page} totalPages={f.totalPages} onChange={f.setPage} />
        </section>
      </div>
    </div>
  );
}

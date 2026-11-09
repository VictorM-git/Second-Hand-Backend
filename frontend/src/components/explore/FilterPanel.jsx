import { conditions } from '../../data/categories.js';
import useActiveCategories from '../../hooks/useActiveCategories.js';
import { localities } from '../../data/localities.js';

// Panel de filtros (RQF005): palabra clave, categoría, estado y ubicación.
export default function FilterPanel({ q, onQ, filters, onCategory, onToggleCondition, onLocation, onClear }) {
  const categories = useActiveCategories(); // solo las activas (RQF010)
  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filtros de búsqueda">
      <div className="filters__group">
        <label htmlFor="filter-q" className="filters__title">Buscar</label>
        <input id="filter-q" type="search" className="filters__control" placeholder="¿Qué estás buscando?"
               value={q} onChange={(e) => onQ(e.target.value)} />
      </div>

      <fieldset className="filters__group">
        <legend className="filters__title">Categoría</legend>
        {['Todos', ...categories].map((c) => (
          <label key={c} className="filters__option">
            <input type="radio" name="category" checked={filters.category === c} onChange={() => onCategory(c)} />
            {c}
          </label>
        ))}
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__title">Estado</legend>
        {conditions.map((c) => (
          <label key={c} className="filters__option">
            <input type="checkbox" checked={filters.conditions.includes(c)} onChange={() => onToggleCondition(c)} />
            {c}
          </label>
        ))}
      </fieldset>

      <div className="filters__group">
        <label htmlFor="filter-location" className="filters__title">Ubicación</label>
        <select id="filter-location" className="filters__control" value={filters.location}
                onChange={(e) => onLocation(e.target.value)}>
          <option value="">Todas las localidades</option>
          {localities.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <button type="button" className="btn btn-sh-outline w-100 btn-sm" onClick={onClear}>Limpiar filtros</button>
    </form>
  );
}

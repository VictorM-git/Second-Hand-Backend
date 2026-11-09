import ItemCard from './ItemCard.jsx';
import useRecentItems from '../hooks/useRecentItems.js';

// Sección "Publicado esta semana". Grilla responsiva con Bootstrap:
// 1 columna (móvil), 2 (tablet), 4 (escritorio).
export default function ItemGrid() {
  const { items, loading, error } = useRecentItems();

  return (
    <section className="sh-featured" aria-labelledby="featured-title">
      <div className="container">
        <h2 id="featured-title" className="sh-section-title">Publicado esta semana</h2>

        {loading && <p role="status">Cargando artículos…</p>}
        {error && <p role="alert" className="text-danger">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p>Aún no hay artículos publicados esta semana. ¡Sé el primero en publicar!</p>
        )}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {items.map((item) => (
            <div className="col" key={item.id}><ItemCard item={item} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

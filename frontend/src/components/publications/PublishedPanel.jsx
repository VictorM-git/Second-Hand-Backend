import { Link } from 'react-router-dom';
import PublicationRow from './PublicationRow.jsx';
import useMyItems from '../../hooks/useMyItems.js';

// Pestaña "Publicados": mis artículos con su estado actual (RQF007).
export default function PublishedPanel() {
  const { items, loading, error, busyId, toggleStatus } = useMyItems();

  return (
    <>
      {loading && <p role="status">Cargando publicaciones…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="explore__empty">
          <p>Aún no has publicado artículos. Lo que ya no usas puede servirle a alguien.</p>
          <Link to="/publicaciones/nueva" className="btn btn-sh btn-sm">Publicar mi primer artículo</Link>
        </div>
      )}

      <div className="req-list">
        {items.map((item) => (
          <PublicationRow key={item.id} item={item} busy={busyId === item.id} onToggle={toggleStatus} />
        ))}
      </div>
    </>
  );
}

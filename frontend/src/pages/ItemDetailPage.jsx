import { Link, useParams } from 'react-router-dom';
import ImageGallery from '../components/detail/ImageGallery.jsx';
import OwnerCard from '../components/detail/OwnerCard.jsx';
import Chip from '../components/Chip.jsx';
import useAsync from '../hooks/useAsync.js';
import { getItemById } from '../services/itemsService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { timeAgo } from '../utils/format.js';

// Detalle de un artículo. En escritorio la información va a un lado de la foto;
// en tablet y móvil todo se apila en una columna (ver .detail__grid en app.css).
export default function ItemDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data: item, loading, error } = useAsync(() => getItemById(id), [id]);

  if (loading) return <div className="detail container-xl"><p role="status">Cargando artículo…</p></div>;
  if (error) return <div className="detail container-xl"><p role="alert" className="text-danger">{error}</p></div>;
  if (!item) {
    return (
      <div className="detail container-xl">
        <h1 className="detail__title">Este artículo ya no está disponible</h1>
        <p><Link to="/explorar">Volver a Explorar</Link></p>
      </div>
    );
  }

  return (
    <div className="detail container-xl">
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/explorar">Explorar</Link>
        <span aria-hidden="true"> / </span>
        <span>{item.category}</span>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{item.title}</span>
      </nav>

      <div className="detail__grid">
        <div className="detail__gallery"><ImageGallery images={item.images} title={item.title} /></div>

        <div className="detail__head">
          <Chip variant={item.status === 'Disponible' ? 'green' : 'grey'}>{item.status}</Chip>
          <h1 className="detail__title">{item.title}</h1>
          <p className="detail__meta">{item.category}, {item.condition.toLowerCase()}</p>
        </div>

        <section className="detail__desc detail__card" aria-labelledby="desc-title">
          <h2 id="desc-title">Descripción</h2>
          {item.description.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        <div className="detail__owner"><OwnerCard owner={item.owner} /></div>

        <div className="detail__actions">
          {isAdmin ? null : item.mine ? (
            // Es una publicación propia: no se puede solicitar, solo editar
            <>
              <p className="detail__published">Esta publicación es tuya.</p>
              <Link to={`/publicaciones/${item.id}/editar`} className="btn btn-sh w-100">Editar publicación</Link>
            </>
          ) : (
            <>
              <Link to={`/articulos/${item.id}/solicitud?tipo=donacion`} className="btn btn-sh w-100">Pedir en donación</Link>
              <Link to={`/articulos/${item.id}/solicitud?tipo=intercambio`} className="btn btn-sh-outline w-100">Proponer un intercambio</Link>
            </>
          )}
          <p className="detail__published">Publicado {timeAgo(item.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import Chip from '../Chip.jsx';
import { formatDay } from '../../utils/format.js';

const STATUS_VARIANT = { Disponible: 'green', 'En proceso': 'yellow', Inactivo: 'red', Entregado: 'grey' };

// Fila de una publicación propia.
// - Entregado: sin acciones.
// - En proceso (solicitud aceptada): se puede editar, pero no inactivar.
export default function PublicationRow({ item, onToggle, busy }) {
  const { id, title, category, createdAt, status, image } = item;
  const editable = status !== 'Entregado';
  const canToggle = status === 'Disponible' || status === 'Inactivo';

  return (
    <article className="req pub">
      <img className="req__img" src={image} alt="" loading="lazy"
           onError={(e) => { e.currentTarget.removeAttribute('src'); }} />

      <div className="req__body">
        <h2 className="req__title"><Link to={`/articulos/${id}`} className="req__link">{title}</Link></h2>
        <p className="req__meta">{category}, publicado el {formatDay(createdAt)}</p>
      </div>

      <div className="req__actions">
        <Chip variant={STATUS_VARIANT[status]}>{status}</Chip>
        {editable && (
          <>
            <Link to={`/publicaciones/${id}/editar`} className="btn btn-sh-outline btn-sm">Editar</Link>
            {canToggle && (
              <button type="button" className="btn btn-sh-outline btn-sm" disabled={busy} onClick={() => onToggle(item)}>
                {status === 'Disponible' ? 'Inactivar' : 'Activar'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}

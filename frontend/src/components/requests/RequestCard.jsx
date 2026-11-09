import { Link } from 'react-router-dom';
import Chip from '../Chip.jsx';
import { formatDay } from '../../utils/format.js';

const STATUS_VARIANT = { Pendiente: 'yellow', Aceptada: 'green', Rechazada: 'red' };

// Fila de una solicitud: foto, resumen, estado y acciones.
// "Ver contacto" solo aparece cuando la solicitud fue aceptada.
export default function RequestCard({ request }) {
  const { id, itemId, title, image, type, counterpart, date, status, note } = request;
  const verb = type === 'Donación' ? 'Donación pedida a' : 'Intercambio propuesto a';

  return (
    <article className="req">
      <img className="req__img" src={image} alt="" loading="lazy"
           onError={(e) => { e.currentTarget.removeAttribute('src'); }} />

      <div className="req__body">
        <h2 className="req__title">{title}</h2>
        <p className="req__meta">{verb} {counterpart} el {formatDay(date)}</p>
        <p className="req__note">{note}</p>
      </div>

      <div className="req__actions">
        <Chip variant={STATUS_VARIANT[status]}>{status}</Chip>
        {status === 'Aceptada' && (
          <Link to={`/mis-solicitudes/${id}/contacto`} className="btn btn-sh-outline btn-sm">Ver contacto</Link>
        )}
        <Link to={`/articulos/${itemId}`} className="btn btn-sh-outline btn-sm">Ver</Link>
      </div>
    </article>
  );
}

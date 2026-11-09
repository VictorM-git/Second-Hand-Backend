import Avatar from '../Avatar.jsx';
import Chip from '../Chip.jsx';

const STATUS_VARIANT = { Pendiente: 'yellow', Aceptada: 'green', Rechazada: 'red' };

// Una solicitud recibida con las acciones que corresponden a su estado:
// Pendiente -> Aceptar / Rechazar · Rechazada -> Eliminar / Deshacer · Aceptada -> Deshacer
export default function ReceivedRequestCard({ request, busy, onRespond, onDelete }) {
  const { id, requester, type, offeredTitle, itemTitle, message, status } = request;
  const accepted = status === 'Aceptada';

  const action = type === 'Donación'
    ? (accepted ? 'pidió en donación' : 'pide en donación')
    : (accepted ? 'propuso un intercambio' : 'propone un intercambio');
  const subject = type === 'Intercambio' && offeredTitle ? `${itemTitle}, ofrece ${offeredTitle}` : itemTitle;

  return (
    <article className="req rcv">
      <Avatar src={requester.photo} name={requester.name} size={48} />

      <div className="req__body">
        <h2 className="req__title">{requester.name} {action}</h2>
        <p className="rcv__item">{subject}</p>
        {message && <p className="rcv__msg">“{message}”</p>}
      </div>

      <div className="req__actions">
        <Chip variant={STATUS_VARIANT[status]}>{status}</Chip>

        {status === 'Pendiente' && (
          <>
            <button type="button" className="btn btn-sh btn-sm" disabled={busy} onClick={() => onRespond(id, 'Aceptada')}>Aceptar</button>
            <button type="button" className="btn btn-sh-outline btn-sm" disabled={busy} onClick={() => onRespond(id, 'Rechazada')}>Rechazar</button>
          </>
        )}
        {status === 'Rechazada' && (
          <>
            <button type="button" className="btn btn-sh btn-sm" disabled={busy} onClick={() => onDelete(id)}>Eliminar</button>
            <button type="button" className="btn btn-sh-outline btn-sm" disabled={busy} onClick={() => onRespond(id, 'Pendiente')}>Deshacer</button>
          </>
        )}
        {accepted && (
          <button type="button" className="btn btn-sh-outline btn-sm" disabled={busy} onClick={() => onRespond(id, 'Pendiente')}>Deshacer</button>
        )}
      </div>
    </article>
  );
}

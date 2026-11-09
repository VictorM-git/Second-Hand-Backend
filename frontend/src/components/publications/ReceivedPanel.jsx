import ReceivedRequestCard from './ReceivedRequestCard.jsx';
import useReceivedRequests from '../../hooks/useReceivedRequests.js';

// Pestaña "Solicitudes recibidas": gestión de las solicitudes sobre mis artículos (RQF006).
export default function ReceivedPanel() {
  const { items, loading, error, busyId, respond, remove } = useReceivedRequests();

  return (
    <>
      {loading && <p role="status">Cargando solicitudes…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="explore__empty"><p>Aún no has recibido solicitudes sobre tus artículos.</p></div>
      )}

      <div className="req-list">
        {items.map((r) => (
          <ReceivedRequestCard key={r.id} request={r} busy={busyId === r.id} onRespond={respond} onDelete={remove} />
        ))}
      </div>
    </>
  );
}

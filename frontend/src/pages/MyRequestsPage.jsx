import { Link, useLocation } from 'react-router-dom';
import RequestCard from '../components/requests/RequestCard.jsx';
import useAsync from '../hooks/useAsync.js';
import { getMyRequests } from '../services/requestsService.js';

// RQF008 - Consultar mis solicitudes
export default function MyRequestsPage() {
  const { data: requests, loading, error } = useAsync(getMyRequests);
  const flash = useLocation().state?.message; // mensaje al volver de enviar una solicitud

  return (
    <div className="page container-xl">
      <div className="page__head">
        <h1>Mis solicitudes</h1>
        <p>Lo que has pedido a otros miembros y en qué va cada caso.</p>
      </div>

      {flash && <p className="auth__success" role="status">{flash}</p>}
      {loading && <p role="status">Cargando solicitudes…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <div className="explore__empty">
          <p>Aún no has hecho solicitudes. Explora los artículos y pide el que necesites.</p>
          <Link to="/explorar" className="btn btn-sh btn-sm">Ir a Explorar</Link>
        </div>
      )}

      <div className="req-list">
        {requests?.map((r) => <RequestCard key={r.id} request={r} />)}
      </div>
    </div>
  );
}

import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PublishedPanel from '../components/publications/PublishedPanel.jsx';
import ReceivedPanel from '../components/publications/ReceivedPanel.jsx';

// RQF007 - Mis publicaciones, con la pestaña de solicitudes recibidas (RQF006).
// La pestaña activa vive en la URL (?tab=solicitudes) para poder enlazarla.
export default function MyPublicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'solicitudes' ? 'solicitudes' : 'publicados';
  const flash = useLocation().state?.message; // mensaje al volver de publicar/editar

  const selectTab = (next) => setSearchParams(next === 'publicados' ? {} : { tab: next });

  return (
    <div className="page container-xl">
      <div className="page__head page__head--row">
        <h1>Mis publicaciones</h1>
        <Link to="/publicaciones/nueva" className="btn btn-sh btn-sm">+ Publicar</Link>
      </div>

      <div className="tabs" role="tablist" aria-label="Secciones">
        <button type="button" role="tab" id="tab-publicados" aria-selected={tab === 'publicados'}
                aria-controls="panel-publicados" className={`tabs__tab${tab === 'publicados' ? ' is-active' : ''}`}
                onClick={() => selectTab('publicados')}>Publicados</button>
        <button type="button" role="tab" id="tab-solicitudes" aria-selected={tab === 'solicitudes'}
                aria-controls="panel-solicitudes" className={`tabs__tab${tab === 'solicitudes' ? ' is-active' : ''}`}
                onClick={() => selectTab('solicitudes')}>Solicitudes recibidas</button>
      </div>

      {flash && <p className="auth__success" role="status">{flash}</p>}

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'publicados' ? <PublishedPanel /> : <ReceivedPanel />}
      </div>
    </div>
  );
}

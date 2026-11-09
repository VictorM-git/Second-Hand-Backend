import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import Chip from '../components/Chip.jsx';
import ReadOnlyField from '../components/ReadOnlyField.jsx';
import useAsync from '../hooks/useAsync.js';
import { getRequestById } from '../services/requestsService.js';
import { formatDate, formatMonthYear } from '../utils/format.js';

// Perfil de contacto de quien aceptó la solicitud (solo si la solicitud está aceptada).
export default function ContactProfilePage() {
  const { id } = useParams();
  const { data: request, loading, error } = useAsync(() => getRequestById(id), [id]);

  if (loading) return <div className="page container-xl"><p role="status">Cargando…</p></div>;
  if (error) return <div className="page container-xl"><p role="alert" className="text-danger">{error}</p></div>;

  // Sin solicitud o sin aceptar, los datos de contacto no se muestran
  if (!request || request.status !== 'Aceptada') {
    return (
      <div className="page container-xl">
        <h1 className="detail__title">Este contacto no está disponible</h1>
        <p>Los datos de contacto se muestran cuando la solicitud es aceptada.</p>
        <Link to="/mis-solicitudes">Volver a Mis solicitudes</Link>
      </div>
    );
  }

  const { contact } = request;
  const firstName = contact.name.split(' ')[0];

  return (
    <div className="page container-xl">
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/mis-solicitudes">Mis solicitudes</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Contacto</span>
      </nav>

      <div className="page__head">
        <h1>Perfil de {contact.name}</h1>
        <p>Datos de contacto de la persona que aceptó tu solicitud.</p>
      </div>

      <div className="contact-grid">
        <section className="card-sh profile-summary" aria-label="Resumen del perfil">
          <Avatar src={contact.photo} name={contact.name} size={96} ring />
          <p className="profile-summary__name">{contact.name}</p>
          <p className="profile-summary__since">Miembro desde {formatMonthYear(contact.memberSince)}</p>
        </section>

        <section className="card-sh" aria-labelledby="contact-info">
          <h2 id="contact-info">Información de contacto</h2>
          <dl className="field-grid">
            <ReadOnlyField label="Correo electrónico">{contact.email}</ReadOnlyField>
            <ReadOnlyField label="Teléfono">{contact.phone}</ReadOnlyField>
            <ReadOnlyField label="Ubicación">{contact.location}, Bogotá</ReadOnlyField>
            <ReadOnlyField label="Instagram">{contact.instagram || '—'}</ReadOnlyField>
          </dl>
        </section>

        <section className="card-sh contact-grid__full" aria-labelledby="contact-request">
          <h2 id="contact-request">Sobre la solicitud</h2>
          <dl className="field-grid">
            <ReadOnlyField label="Artículo">{request.title}</ReadOnlyField>
            <ReadOnlyField label="Tipo">{request.type}</ReadOnlyField>
            <ReadOnlyField label="Estado" plain><Chip variant="green">{request.status}</Chip></ReadOnlyField>
            <ReadOnlyField label="Fecha de aceptación">{formatDate(request.acceptedAt)}</ReadOnlyField>
          </dl>
          <p className="contact-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
            </svg>
            Coordina la entrega directamente con {firstName}. Recuerda acordar un lugar seguro y conveniente para ambos.
          </p>
        </section>
      </div>
    </div>
  );
}

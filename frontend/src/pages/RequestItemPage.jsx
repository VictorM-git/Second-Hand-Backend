import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import Chip from '../components/Chip.jsx';
import FormField from '../components/auth/FormField.jsx';
import useAsync from '../hooks/useAsync.js';
import useForm from '../hooks/useForm.js';
import { getItemById } from '../services/itemsService.js';
import { getMyItems } from '../services/myItemsService.js';
import { createRequest } from '../services/requestsService.js';

// RQF006 - Solicitar un artículo (donación o intercambio)
export default function RequestItemPage() {
  const { id } = useParams();
  const { data: item, loading, error } = useAsync(() => getItemById(id), [id]);

  if (loading) return <div className="page container-xl"><p role="status">Cargando artículo…</p></div>;
  if (error) return <div className="page container-xl"><p role="alert" className="text-danger">{error}</p></div>;

  if (!item || item.status !== 'Disponible') {
    return (
      <div className="page container-xl">
        <h1 className="detail__title">Este artículo no está disponible</h1>
        <Link to="/explorar">Volver a Explorar</Link>
      </div>
    );
  }

  if (item.mine) {
    return (
      <div className="page container-xl">
        <h1 className="detail__title">Este artículo es tuyo</h1>
        <p>No puedes enviarte una solicitud a ti mismo.</p>
        <Link to={`/articulos/${item.id}`}>Volver al artículo</Link>
      </div>
    );
  }

  return <RequestForm item={item} />;
}

function RequestForm({ item }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: myItems } = useAsync(getMyItems);
  const offerable = (myItems ?? []).filter((i) => i.status === 'Disponible');
  const ownerFirstName = item.owner.name.split(' ')[0];

  const validate = (v) => ({
    type: '',
    offeredItemId: v.type === 'Intercambio' && !v.offeredItemId ? 'Elige el artículo que ofreces a cambio.' : '',
    message: v.message.trim().length >= 10 ? '' : 'Escribe un mensaje (mínimo 10 caracteres).',
  });

  const { values, errors, submitError, submitting, handleChange, setValue, handleSubmit } = useForm(
    {
      type: searchParams.get('tipo') === 'intercambio' ? 'Intercambio' : 'Donación', // viene del botón del detalle
      offeredItemId: '',
      message: '',
    },
    validate,
    async (v) => {
      const offeredItem = v.type === 'Intercambio' ? offerable.find((i) => i.id === v.offeredItemId) : null;
      await createRequest(item, { type: v.type, offeredItem, message: v.message.trim() });
      navigate('/mis-solicitudes', { state: { message: 'Solicitud enviada.' } });
    }
  );

  const isExchange = values.type === 'Intercambio';

  const onTypeChange = (e) => {
    handleChange(e);
    if (e.target.value === 'Donación') setValue('offeredItemId', ''); // la donación no lleva artículo a cambio
  };

  return (
    <div className="page container-xl">
      <nav className="crumbs" aria-label="Ruta de navegación">
        <Link to="/explorar">Explorar</Link>
        <span aria-hidden="true"> / </span>
        <span>{item.category}</span>
        <span aria-hidden="true"> / </span>
        <Link to={`/articulos/${item.id}`}>{item.title}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Solicitud</span>
      </nav>

      <div className="page__head">
        <h1>Pedir este artículo</h1>
        <p>{ownerFirstName} recibirá tu mensaje y decidirá si acepta.</p>
      </div>

      <div className="request-grid">
        <aside className="card-sh request-summary" aria-label="Artículo solicitado">
          <img className="request-summary__img" src={item.image} alt={item.title}
               onError={(e) => { e.currentTarget.removeAttribute('src'); }} />
          <h2 className="request-summary__title">{item.title}</h2>
          <p className="request-summary__meta">
            {item.category}, {item.condition.toLowerCase()} · {item.location}
          </p>
          <div className="request-summary__owner">
            <div className="request-summary__owner-head">
              <span>Publicado por</span>
              <Chip variant="green">{item.status}</Chip>
            </div>
            <div className="owner__row">
              <Avatar src={item.owner.photo} name={item.owner.name} size={32} />
              <p className="owner__name">{item.owner.name}</p>
            </div>
          </div>
        </aside>

        <section className="card-sh field-light request-grid__form" aria-label="Formulario de solicitud">
          <form onSubmit={handleSubmit} noValidate>
            <FormField id="type" label="Tipo de solicitud" as="select" value={values.type} onChange={onTypeChange}>
              <option value="Donación">Donación</option>
              <option value="Intercambio">Intercambio</option>
            </FormField>

            <FormField id="offeredItemId" label="Artículo que ofreces a cambio" as="select"
                       disabled={!isExchange} value={values.offeredItemId}
                       onChange={handleChange} error={errors.offeredItemId}>
              <option value="">
                {!isExchange ? 'Solo si eliges intercambio'
                  : offerable.length ? 'Selecciona uno de tus artículos' : 'No tienes artículos disponibles para ofrecer'}
              </option>
              {offerable.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
            </FormField>

            <FormField id="message" label="Mensaje" as="textarea" rows={6}
                       placeholder="Cuéntale para qué lo necesitas y cuándo podrías recogerlo."
                       value={values.message} onChange={handleChange} error={errors.message} />

            {submitError && <p className="auth__alert" role="alert">{submitError}</p>}

            <div className="form-actions mt-3">
              <button type="submit" className="btn btn-sh" disabled={submitting}>
                {submitting ? 'Enviando…' : 'Enviar solicitud'}
              </button>
              <Link to={`/articulos/${item.id}`} className="btn btn-sh-outline">Cancelar</Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
